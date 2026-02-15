import { projects } from '../content/projects';
import { Link } from 'react-router-dom';
import PictureImage from '../components/PictureImage';

// 项目卡片组件
function ProjectCard({ project, className = '', aspectRatio = 'aspect-[16/9]' }) {
  return (
    <div className={`relative group cursor-pointer overflow-hidden ${className}`}>
      <div className={`relative w-full ${aspectRatio}`}>
        <PictureImage
          imagePath={project.imagePath}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-end">
            <h3 className="text-sm font-bold text-white drop-shadow-lg">
              {project.name}
            </h3>
            <p className="text-sm text-white/80 drop-shadow-md">
              {project.location}
            </p>
            <span className="text-sm text-white/60 uppercase tracking-wider">
              {project.statusLabel} · {project.categoryLabel}
            </span>
          </div>
        </div>
        <Link
          to={`/projects/${project.id}`}
          className="absolute inset-0 z-20 hover:bg-white/10 transition-colors"
        />
      </div>
    </div>
  );
}

export function ProposedProjectsPage() {
  // 筛选"提案中"项目
  const proposedProjects = projects.filter(p => p.status === 'proposed');

  // 按照混合布局分配项目
  // 当前只有1个项目，使用全宽布局
  const row1Project = proposedProjects.find(p => p.id === 'macalline-anji');

  return (
    <div className="min-h-screen pt-16 bg-[#181818]">
      <div className="w-full mx-auto px-3 py-8">
        {/* 第1行: 全宽大图 */}
        {row1Project && (
          <div className="mb-3">
            <ProjectCard project={row1Project} aspectRatio="aspect-[21/9]" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProposedProjectsPage;

