import { Link, useSearchParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { categoryPriorityOverrides, projectPriorityMap, projectsDisplayConfig } from '../content/projects-display-config';
import PictureImage from '../components/PictureImage';
import { getCategoryLabel, getProjectLocation, getProjectName, getStatusLabel, useLanguage } from '../i18n.jsx';

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
  landscape: { imageField: 'landscapeImages' },
  interior: { imageField: 'interiorImages' },
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

function getProjectPriority(projectId, category = '') {
  const categoryOverrides = categoryPriorityOverrides[category];
  if (categoryOverrides && categoryOverrides[projectId] !== undefined) {
    return categoryOverrides[projectId];
  }

  return projectPriorityMap[projectId] || 0;
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
    const priorityDiff = getProjectPriority(b.id, options.category) - getProjectPriority(a.id, options.category);
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
    const basePriority = getProjectPriority(project.id, options.category);
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

function ProjectCard({ card, lang, t, aspectRatio = 'aspect-[16/9]', heightClass = '', className = '' }) {
  const { project, imagePath, imageTitle } = card;
  const mediaSizeClass = heightClass || aspectRatio;

  return (
    <div className={`relative group cursor-pointer overflow-hidden ${className}`}>
      <div className={`relative w-full ${mediaSizeClass}`}>
        <PictureImage
          imagePath={imagePath}
          alt={imageTitle ? `${getProjectName(project, lang)} · ${imageTitle}` : getProjectName(project, lang)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-end">
            <h3 className="text-sm font-bold text-white drop-shadow-lg">{getProjectName(project, lang)}</h3>
            <p className="text-sm text-white/80 drop-shadow-md">{getProjectLocation(project, lang)}</p>
            <span className="text-sm text-white/60 uppercase tracking-wider">
              {getStatusLabel(project.status, lang)} · {getCategoryLabel(project.category, lang)}
            </span>
            {imageTitle && (
              <span className="text-xs text-white/75 uppercase tracking-wider">{imageTitle}</span>
            )}
          </div>
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="absolute inset-0 z-20 hover:bg-white/10 transition-colors"
          aria-label={`${t('common.viewProject')} ${getProjectName(project, lang)}`}
        />
      </div>
    </div>
  );
}

function CategoryProjectSection({ cards, lang, t }) {
  const heroCard = cards[0];
  const twoColumnCards = cards.slice(1, 3);
  const fourGridCards = cards.slice(3, 7);
  const restCards = cards.slice(7);

  return (
    <section className="mb-8">
      {heroCard && (
        <div className="mb-3">
          <ProjectCard card={heroCard} lang={lang} t={t} aspectRatio="aspect-[21/9]" />
        </div>
      )}

      {twoColumnCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          {twoColumnCards.map(card => (
            <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[16/7]" />
          ))}
        </div>
      )}

      {fourGridCards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {fourGridCards.map(card => (
            <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[4/3]" />
          ))}
        </div>
      )}

      {restCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {restCards.map(card => (
            <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[16/10]" />
          ))}
        </div>
      )}
    </section>
  );
}

function classifyArchitectureCards(cards) {
  const level1 = [];
  const level2 = [];
  const level3 = [];

  cards.forEach(card => {
    const score = getProjectPriority(card.project.id, 'architecture');
    if (score >= 215) {
      level1.push(card);
    } else if (score >= 200) {
      level2.push(card);
    } else {
      level3.push(card);
    }
  });

  return { level1, level2, level3 };
}

export function ProjectsPage() {
  const { lang, t } = useLanguage();
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
      .sort((a, b) => getProjectPriority(b.id, category) - getProjectPriority(a.id, category))
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
  // 品尊国际、开云艾尚里用2列大图，后面3个用3列小图
  const finalizedTwoColCards = finalizedSmallCards.slice(0, 2);
  const finalizedThreeColCards = finalizedSmallCards.slice(2);
  const architectureLevels = category === 'architecture' ? classifyArchitectureCards(cards) : null;

  return (
    <div className="min-h-screen pt-16 bg-[#181818]">
      <div className="w-full mx-auto px-3 py-8">
        {cards.length === 0 && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-xl text-white mb-2">{t('common.noMatch')}</h2>
            <p className="text-white/60 mb-6">{t('common.switchFilter')}</p>
            <Link to="/all-projects" className="px-4 py-2 border border-white/40 text-white/90 hover:bg-white/10 transition-colors">
              {t('common.viewAllProjects')}
            </Link>
          </div>
        )}

        {activeSpecialCategory ? (
          <>
            {specialSections.map(section => (
              <CategoryProjectSection
                key={`${category}-section-${section.project.id}`}
                lang={lang}
                t={t}
                cards={section.cards}
              />
            ))}
          </>
        ) : category === 'architecture' ? (
          (() => {
            const used = new Set();

            const pickById = (projectId) => {
              const found = cards.find(card => card.project.id === projectId && !used.has(card.key));
              if (found) {
                used.add(found.key);
                return found;
              }
              return null;
            };

            const pickNext = () => {
              const found = cards.find(card => !used.has(card.key));
              if (found) {
                used.add(found.key);
                return found;
              }
              return null;
            };

            const row1Hero = pickById('one-park-gubei') || pickNext();
            const row2LeftTop = pickById('royal-pavilion') || pickNext();
            const row2LeftBottom = pickById('upper-east') || pickNext();
            const row2Right = pickById('rongxinarc') || pickNext();
            const row3SmallA = pickById('moment-to-cloud') || pickNext();
            const row3SmallB = pickById('macalline-anji') || pickNext();
            const row3Wide = pickById('prime-dynapolis') || pickNext();
            const tailCards = cards.filter(card => !used.has(card.key));
            const mixedRowClass = 'grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 md:h-[26vw] md:min-h-[240px] md:max-h-[360px]';
            const mixedRowCardHeight = 'h-[56vw] min-h-[240px] max-h-[360px] md:h-full';

            return (
              <>
                {row1Hero && (
                  <div className="mb-3">
                    <ProjectCard card={row1Hero} lang={lang} t={t} aspectRatio="aspect-[21/9]" />
                  </div>
                )}

                {(row2LeftTop || row2LeftBottom || row2Right) && (
                  <div className={mixedRowClass}>
                    {row2LeftTop && (
                      <div className="md:col-span-1">
                        <ProjectCard card={row2LeftTop} lang={lang} t={t} heightClass={mixedRowCardHeight} className="h-full" />
                      </div>
                    )}
                    {row2LeftBottom && (
                      <div className="md:col-span-1">
                        <ProjectCard card={row2LeftBottom} lang={lang} t={t} heightClass={mixedRowCardHeight} className="h-full" />
                      </div>
                    )}
                    {row2Right && (
                      <div className="md:col-span-2">
                        <ProjectCard card={row2Right} lang={lang} t={t} heightClass={mixedRowCardHeight} className="h-full" />
                      </div>
                    )}
                  </div>
                )}

                {(row3SmallA || row3SmallB || row3Wide) && (
                  <div className={mixedRowClass}>
                    {row3Wide && (
                      <div className="md:col-span-2">
                        <ProjectCard card={row3Wide} lang={lang} t={t} heightClass={mixedRowCardHeight} className="h-full" />
                      </div>
                    )}
                    {row3SmallA && (
                      <div className="md:col-span-1">
                        <ProjectCard card={row3SmallA} lang={lang} t={t} heightClass={mixedRowCardHeight} className="h-full" />
                      </div>
                    )}
                    {row3SmallB && (
                      <div className="md:col-span-1">
                        <ProjectCard card={row3SmallB} lang={lang} t={t} heightClass={mixedRowCardHeight} className="h-full" />
                      </div>
                    )}
                  </div>
                )}

                {tailCards.length > 0 && (
                  <div>
                    {Array.from({ length: Math.ceil(tailCards.length / 3) }, (_, rowIndex) => {
                      const row = tailCards.slice(rowIndex * 3, rowIndex * 3 + 3);

                      if (row.length === 1) {
                        return (
                          <div key={`tail-row-${rowIndex}`} className="mb-3 last:mb-0">
                            <ProjectCard card={row[0]} lang={lang} t={t} aspectRatio="aspect-[16/6]" />
                          </div>
                        );
                      }

                      if (row.length === 2) {
                        return (
                          <div key={`tail-row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 last:mb-0">
                            <ProjectCard card={row[0]} lang={lang} t={t} aspectRatio="aspect-[16/7]" />
                            <ProjectCard card={row[1]} lang={lang} t={t} aspectRatio="aspect-[16/7]" />
                          </div>
                        );
                      }

                      return (
                        <div
                          key={`tail-row-${rowIndex}`}
                          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 last:mb-0 md:h-[26vw] md:min-h-[240px] md:max-h-[360px]"
                        >
                          <div className="md:col-span-1">
                            <ProjectCard card={row[0]} lang={lang} t={t} heightClass="h-[56vw] min-h-[240px] max-h-[360px] md:h-full" className="h-full" />
                          </div>
                          <div className="md:col-span-1">
                            <ProjectCard card={row[1]} lang={lang} t={t} heightClass="h-[56vw] min-h-[240px] max-h-[360px] md:h-full" className="h-full" />
                          </div>
                          <div className="md:col-span-2">
                            <ProjectCard card={row[2]} lang={lang} t={t} heightClass="h-[56vw] min-h-[240px] max-h-[360px] md:h-full" className="h-full" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()
        ) : (
          <>
            {heroCard && (
              <div className="mb-3">
                <ProjectCard card={heroCard} lang={lang} t={t} aspectRatio="aspect-[21/9]" />
              </div>
            )}

            {twoColumnCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                {twoColumnCards.map(card => (
                  <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[16/7]" />
                ))}
              </div>
            )}

            {useFinalizedFeaturedLayout ? (
              <>
                {secondHeroCard && (
                  <div className="mb-3">
                    <ProjectCard card={secondHeroCard} lang={lang} t={t} aspectRatio="aspect-[16/6]" />
                  </div>
                )}
                {finalizedTwoColCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {finalizedTwoColCards.map(card => (
                      <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[16/9]" />
                    ))}
                  </div>
                )}
                {finalizedThreeColCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {finalizedThreeColCards.map(card => (
                      <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[16/10]" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {fourGridCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    {fourGridCards.map(card => (
                      <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[4/3]" />
                    ))}
                  </div>
                )}

                {restCards.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {restCards.map(card => (
                      <ProjectCard key={card.key} card={card} lang={lang} t={t} aspectRatio="aspect-[16/10]" />
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


