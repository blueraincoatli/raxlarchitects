import { projects } from '../content/projects';
import { Link } from 'react-router-dom';
import PictureImage from '../components/PictureImage';
import { getCategoryLabel, getProjectLocation, getProjectName, getStatusLabel, useLanguage } from '../i18n.jsx';

// 项目卡片组件
function ProjectCard({ project, lang, className = '', aspectRatio = 'aspect-[16/9]' }) {
  return (
    <div className={`relative group cursor-pointer overflow-hidden ${className}`}>
      <div className={`relative w-full ${aspectRatio}`}>
        <PictureImage
          imagePath={project.imagePath}
          alt={getProjectName(project, lang)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 z-10">
          <div className="flex flex-wrap gap-x-4 gap-y-1 items-end">
            <h3 className="text-sm font-bold text-white drop-shadow-lg">
              {getProjectName(project, lang)}
            </h3>
            <p className="text-sm text-white/80 drop-shadow-md">
              {getProjectLocation(project, lang)}
            </p>
            <span className="text-sm text-white/60 uppercase tracking-wider">
              {getStatusLabel(project.status, lang)} · {getCategoryLabel(project.category, lang)}
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
  const { lang } = useLanguage();
  // 筛选"建设中"项目
  const underConstructionProjects = projects.filter(p => p.status === 'under-construction');

  // 按照混合布局分配项目
  // 第1行: 全宽 - 品尊国际（三期）
  const row1Project = underConstructionProjects.find(p => p.id === 'prime-dynapolis');

  // 第2行: 60/40 - 开云·艾尚里(60%) + 新湖·天虹(40%)
  const row2Left = underConstructionProjects.find(p => p.id === 'moment-to-cloud');
  const row2Right = underConstructionProjects.find(p => p.id === 'lot-hk231');

  return (
    <div className="min-h-screen pt-16 bg-[#181818]">
      <div className="w-full mx-auto px-3 py-8">
        {/* 第1行: 全宽大图 */}
        {row1Project && (
          <div className="mb-3">
            <ProjectCard project={row1Project} lang={lang} aspectRatio="aspect-[21/9]" />
          </div>
        )}

        {/* 第2行: 60/40 双栏，高度为第1行的一半 */}
        <div className="flex gap-3">
          {row2Left && (
            <div className="w-[60%]">
              <ProjectCard project={row2Left} lang={lang} aspectRatio="aspect-[14/5]" />
            </div>
          )}
          {row2Right && (
            <div className="w-[40%]">
              <ProjectCard project={row2Right} lang={lang} aspectRatio="aspect-[9.33/5]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnderConstructionPage;


