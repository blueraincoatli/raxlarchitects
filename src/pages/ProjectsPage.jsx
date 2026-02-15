import { Link, useSearchParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { projectPriorityMap, projectsDisplayConfig } from '../content/projects-display-config';
import PictureImage from '../components/PictureImage';

function normalizeImageItems(project, maxImagesPerProject, forcePaths = null) {
  const fallbackImages = [project.imagePath, ...(project.gallery || [])].filter(Boolean);
  const forced = Array.isArray(forcePaths) && forcePaths.length > 0
    ? forcePaths
    : null;
  const featured = (project.featuredImages && project.featuredImages.length > 0)
    ? project.featuredImages
    : (forced || fallbackImages).map((path, index) => ({
      path,
      weight: Math.max(1, 100 - index * 10),
    }));

  const deduped = [];
  const seen = new Set();

  featured.forEach((image, index) => {
    const path = typeof image === 'string' ? image : image.path;

    if (!path || seen.has(path)) {
      return;
    }

    seen.add(path);
    deduped.push({
      path,
      title: typeof image === 'string' ? '' : (image.title || ''),
      weight: typeof image === 'string' ? Math.max(1, 100 - index * 10) : (image.weight ?? Math.max(1, 100 - index * 10)),
    });
  });

  return deduped.slice(0, maxImagesPerProject);
}

const specialCategoryConfig = {
  landscape: { imageField: 'landscapeImages', sectionLabel: '景观设计' },
  interior: { imageField: 'interiorImages', sectionLabel: '室内设计' },
};

function interleaveByProject(cards) {
  if (!projectsDisplayConfig.enforceNoConsecutiveSameProject) {
    return cards;
  }

  const queue = [...cards];
  const result = [];

  while (queue.length > 0) {
    const previousProjectId = result[result.length - 1]?.project.id;
    const index = queue.findIndex(item => item.project.id !== previousProjectId);

    if (index === -1) {
      result.push(queue.shift());
    } else {
      const [picked] = queue.splice(index, 1);
      result.push(picked);
    }
  }

  return result;
}

function buildCards(filteredProjects, options = {}) {
  const specialCategory = specialCategoryConfig[options.category];
  const mode = projectsDisplayConfig.mode === 'multi' ? 'multi' : 'single';
  const maxImagesPerProject = specialCategory
    ? 200
    : mode === 'multi'
    ? Math.max(1, projectsDisplayConfig.maxImagesPerProject || 3)
    : 1;

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const priorityDiff = (projectPriorityMap[b.id] || 0) - (projectPriorityMap[a.id] || 0);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    if (yearDiff !== 0) {
      return yearDiff;
    }

    return a.name.localeCompare(b.name, 'zh-CN');
  });

  const cards = sortedProjects.flatMap(project => {
    const basePriority = projectPriorityMap[project.id] || 0;
    const forcedPaths = specialCategory ? project[specialCategory.imageField] : null;
    const imageItems = normalizeImageItems(project, maxImagesPerProject, forcedPaths);

    return imageItems.map((image, index) => ({
      key: `${project.id}-${index}`,
      project,
      imagePath: image.path,
      imageTitle: image.title,
      score: basePriority * 1000 + (image.weight || 0),
    }));
  }).sort((a, b) => b.score - a.score);

  return interleaveByProject(cards);
}

function ProjectCard({ card, aspectRatio = 'aspect-[16/9]' }) {
  const { project, imagePath, imageTitle } = card;

  return (
    <div className="relative group cursor-pointer overflow-hidden">
      <div className={`relative w-full ${aspectRatio}`}>
        <PictureImage
          imagePath={imagePath}
          alt={imageTitle ? `${project.name} · ${imageTitle}` : project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-end">
            <h3 className="text-sm font-bold text-white drop-shadow-lg">{project.name}</h3>
            <p className="text-sm text-white/80 drop-shadow-md">{project.location}</p>
            <span className="text-sm text-white/60 uppercase tracking-wider">
              {project.statusLabel} · {project.categoryLabel}
            </span>
            {imageTitle && (
              <span className="text-xs text-white/75 uppercase tracking-wider">{imageTitle}</span>
            )}
          </div>
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="absolute inset-0 z-20 hover:bg-white/10 transition-colors"
          aria-label={`View ${project.name}`}
        />
      </div>
    </div>
  );
}

function CategoryProjectSection({ project, cards, sectionLabel }) {
  const heroCard = cards[0];
  const twoColumnCards = cards.slice(1, 3);
  const fourGridCards = cards.slice(3, 7);
  const restCards = cards.slice(7);

  return (
    <section className="mb-8">
      <div className="mb-3">
        <h2 className="text-sm md:text-base text-white/90 tracking-wider uppercase">
          {project.name} · {sectionLabel}
        </h2>
      </div>

      {heroCard && (
        <div className="mb-3">
          <ProjectCard card={heroCard} aspectRatio="aspect-[21/9]" />
        </div>
      )}

      {twoColumnCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {twoColumnCards.map(card => (
            <ProjectCard key={card.key} card={card} aspectRatio="aspect-[16/7]" />
          ))}
        </div>
      )}

      {fourGridCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {fourGridCards.map(card => (
            <ProjectCard key={card.key} card={card} aspectRatio="aspect-[4/3]" />
          ))}
        </div>
      )}

      {restCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {restCards.map(card => (
            <ProjectCard key={card.key} card={card} aspectRatio="aspect-[16/10]" />
          ))}
        </div>
      )}
    </section>
  );
}

export function ProjectsPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';

  const filteredProjects = projects.filter(project => {
    const statusMatch = !status || project.status === status;
    const categoryMatch = !category
      || project.category === category
      || (category === 'landscape' && project.subCategory === 'landscape');
    return statusMatch && categoryMatch;
  });

  const cards = buildCards(filteredProjects, { category });
  const activeSpecialCategory = specialCategoryConfig[category];
  const specialSections = activeSpecialCategory
    ? [...filteredProjects]
      .sort((a, b) => (projectPriorityMap[b.id] || 0) - (projectPriorityMap[a.id] || 0))
      .map(project => ({
        project,
        cards: normalizeImageItems(project, 200, project[activeSpecialCategory.imageField])
          .map((image, index) => ({
            key: `${project.id}-${category}-${index}`,
            project,
            imagePath: image.path,
            imageTitle: image.title,
          })),
      }))
      .filter(section => section.cards.length > 0)
    : [];
  const heroCard = cards[0];
  const twoColumnCards = cards.slice(1, 3);
  const fourGridCards = cards.slice(3, 7);
  const restCards = cards.slice(7);
  const useFinalizedFeaturedLayout = status === 'finalized' && !category && cards.length >= 4;
  const secondHeroCard = useFinalizedFeaturedLayout ? cards[3] : null;
  const finalizedSmallCards = useFinalizedFeaturedLayout ? cards.slice(4) : [];

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <div className="w-full mx-auto px-3 py-8">
        {cards.length === 0 && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-xl text-white mb-2">暂无匹配项目</h2>
            <p className="text-white/60 mb-6">请切换筛选条件查看其他项目。</p>
            <Link to="/all-projects" className="px-4 py-2 border border-white/40 text-white/90 hover:bg-white/10 transition-colors">
              查看全部项目
            </Link>
          </div>
        )}

        {activeSpecialCategory ? (
          <>
            {specialSections.map(section => (
              <CategoryProjectSection
                key={`${category}-section-${section.project.id}`}
                project={section.project}
                cards={section.cards}
                sectionLabel={activeSpecialCategory.sectionLabel}
              />
            ))}
          </>
        ) : (
          <>
            {heroCard && (
              <div className="mb-3">
                <ProjectCard card={heroCard} aspectRatio="aspect-[21/9]" />
              </div>
            )}

            {twoColumnCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {twoColumnCards.map(card => (
                  <ProjectCard key={card.key} card={card} aspectRatio="aspect-[16/7]" />
                ))}
              </div>
            )}

            {useFinalizedFeaturedLayout ? (
              <>
                {secondHeroCard && (
                  <div className="mb-3">
                    <ProjectCard card={secondHeroCard} aspectRatio="aspect-[16/6]" />
                  </div>
                )}
                {finalizedSmallCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {finalizedSmallCards.map(card => (
                      <ProjectCard key={card.key} card={card} aspectRatio="aspect-[16/10]" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {fourGridCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {fourGridCards.map(card => (
                      <ProjectCard key={card.key} card={card} aspectRatio="aspect-[4/3]" />
                    ))}
                  </div>
                )}

                {restCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {restCards.map(card => (
                      <ProjectCard key={card.key} card={card} aspectRatio="aspect-[16/10]" />
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectsPage;
