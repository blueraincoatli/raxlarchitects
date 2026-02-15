import { Link } from 'react-router-dom';
import { projects } from '../content/projects';
import PictureImage from '../components/PictureImage';
import { getCategoryLabel, getProjectLocation, getProjectName, getStatusLabel, useLanguage } from '../i18n.jsx';

function AllProjectsPage() {
  const { lang } = useLanguage();
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
                <PictureImage
                  imagePath={project.imagePath}
                  alt={project.name}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110"
                />

                {/* 文字叠加 - 左下角 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
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
                <PictureImage
                  imagePath={project.imagePath}
                  alt={project.name}
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-110"
                />

                {/* 文字叠加 - 左下角 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
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
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllProjectsPage;

