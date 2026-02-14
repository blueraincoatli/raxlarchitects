import { Link } from 'react-router-dom';
import { projects } from '../content/projects';

function AllProjectsPage() {
  // 分割项目为左右两列
  const leftColumn = projects.filter((_, index) => [0, 2, 4, 6, 8, 10].includes(index)); // 1,3,5,7,9,11
  const rightColumn = projects.filter((_, index) => [1, 3, 5, 7, 9, 11].includes(index)); // 2,4,6,8, 10

  return (
    <div className="pt-32 pb-16 px-6 lg:px-10">
      {/* 瀑布流布局 - 2列，指定排列顺序 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 左列 - 单数位置 */}
        {leftColumn.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="break-inside-avoid block group"
          >
            <div className="relative overflow-hidden transition-transform hover:scale-[1.02]">
              <img
                src={`/images/projects/${project.id}.jpg`}
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

        {/* 右列 - 双数位置 */}
        {rightColumn.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="break-inside-avoid block group"
          >
            <div className="relative overflow-hidden transition-transform hover:scale-[1.02]">
              <img
                src={`/images/projects/${project.id}.jpg`}
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
  );
}

export default AllProjectsPage;
