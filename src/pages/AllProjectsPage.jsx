import { Link } from 'react-router-dom';
import { projects } from '../content/projects';

function AllProjectsPage() {
  // 分割项目为左右两列，交替摆放
  // 左列：奇数位置 1,3,5,7,9,11
  // 右列：偶数位置 2,4,6,8,10
  const leftColumn = projects.filter((_, index) => index % 2 === 0);
  const rightColumn = projects.filter((_, index) => index % 2 === 1);

  return (
    <div className="pt-32 pb-16 px-6 lg:px-10">
      {/* 瀑布流布局 - 两列独立容器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 左列 - 奇数位置 */}
        <div className="flex flex-col gap-3">
          {leftColumn.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="break-inside-avoid block group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.imagePath}
                  alt={project.name}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110"
                />

                {/* 文字叠加 - 左下角 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  <h3 className="text-lg font-light text-white mb-1 drop-shadow-lg">
                    {project.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-2 drop-shadow-md">
                    {project.location}
                  </p>
                  <div className="flex gap-4 text-xs text-white/60 uppercase tracking-wider">
                    <span>{project.statusLabel}</span>
                    <span>·</span>
                    <span>{project.categoryLabel}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 右列 - 偶数位置 */}
        <div className="flex flex-col gap-3">
          {rightColumn.map(project => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="break-inside-avoid block group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.imagePath}
                  alt={project.name}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110"
                />

                {/* 文字叠加 - 左下角 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                  <h3 className="text-lg font-light text-white mb-1 drop-shadow-lg">
                    {project.name}
                  </h3>
                  <p className="text-sm text-white/80 mb-2 drop-shadow-md">
                    {project.location}
                  </p>
                  <div className="flex gap-4 text-xs text-white/60 uppercase tracking-wider">
                    <span>{project.statusLabel}</span>
                    <span>·</span>
                    <span>{project.categoryLabel}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllProjectsPage;
