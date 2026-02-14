import { projects } from '../content/projects';
import { Link } from 'react-router-dom';

// 项目卡片组件
function ProjectCard({ project, className = '', aspectRatio = 'aspect-[16/9]' }) {
  return (
    <div className={`relative group cursor-pointer overflow-hidden ${className}`}>
      <div className={`relative w-full ${aspectRatio}`}>
        <img
          src={project.imagePath}
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

export function UnderConstructionPage() {
  // 筛选"建设中"项目
  const underConstructionProjects = projects.filter(p => p.status === 'under-construction');

  // 按照混合布局分配项目
  // 第1行: 全宽 - 品尊国际（三期）
  const row1Project = underConstructionProjects.find(p => p.id === 'prime-dynapolis');

  // 第2行: 60/40 - 开云·艾尚里(60%) + 新湖·天虹(40%)
  const row2Left = underConstructionProjects.find(p => p.id === 'moment-to-cloud');
  const row2Right = underConstructionProjects.find(p => p.id === 'lot-hk231');

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <div className="w-full mx-auto px-3 py-8">
        {/* 第1行: 全宽大图 */}
        {row1Project && (
          <div className="mb-3">
            <ProjectCard project={row1Project} aspectRatio="aspect-[21/9]" />
          </div>
        )}

        {/* 第2行: 60/40 双栏，高度为第1行的一半 */}
        <div className="flex gap-3">
          {row2Left && (
            <div className="w-[60%]">
              <ProjectCard project={row2Left} aspectRatio="aspect-[14/5]" />
            </div>
          )}
          {row2Right && (
            <div className="w-[40%]">
              <ProjectCard project={row2Right} aspectRatio="aspect-[9.33/5]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnderConstructionPage;
