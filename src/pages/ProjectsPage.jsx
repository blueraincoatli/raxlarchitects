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

export function ProjectsPage() {
  // 按照参考布局分配项目
  // 第1行: 全宽 - 古北壹号
  const row1Project = projects.find(p => p.id === 'one-park-gubei');
  
  // 第2行: 60/40 - 华山公寓(60%) + 尚东鼎(40%)
  const row2Left = projects.find(p => p.id === 'royal-pavilion');
  const row2Right = projects.find(p => p.id === 'upper-east');
  
  // 第3行: 全宽 - 杭州融信
  const row3Project = projects.find(p => p.id === 'rongxinarc');
  
  // 第4行: 左侧双图堆叠 + 右侧2x2矩阵
  // 左侧: Chairclub + Content Office
  const row4LeftTop = projects.find(p => p.id === 'chairclub');
  const row4LeftBottom = projects.find(p => p.id === 'content-office-shop');
  // 右侧: Content Show (使用gallery图片填充4格)
  const row4Right = projects.find(p => p.id === 'content-show');

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
        <div className="flex gap-3 mb-3">
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

        {/* 第3行: 全宽大图 */}
        {row3Project && (
          <div className="mb-3">
            <ProjectCard project={row3Project} aspectRatio="aspect-[16/6]" />
          </div>
        )}

        {/* 第4行: 左侧双图堆叠 + 右侧单图 */}
        <div className="flex gap-3">
          {/* 左侧: 双图堆叠 (50%宽度) */}
          <div className="w-1/2 flex flex-col gap-3">
            {row4LeftTop && (
              <ProjectCard project={row4LeftTop} aspectRatio="aspect-[32/9]" />
            )}
            {row4LeftBottom && (
              <ProjectCard project={row4LeftBottom} aspectRatio="aspect-[32/9]" />
            )}
          </div>

          {/* 右侧: Content Show 单图 (50%宽度) */}
          <div className="w-1/2">
            {row4Right && (
              <ProjectCard project={row4Right} aspectRatio="aspect-[16/9]" className="h-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
