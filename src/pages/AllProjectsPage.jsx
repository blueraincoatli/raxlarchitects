import { Link } from 'react-router-dom';
import { projects } from '../content/projects';

// 图片文件ID映射表（images/projects目录下按数字序号排列）
const imageIdMap = {
  'one-park-gubei': '01-one-park-gubei',      // 1-古北壹号
  'royal-pavilion': '02-RoyalPavilion',        // 2-华山公寓
  'shanghai-pudi': '03-upper-east',           // 3-尚东鼎（使用03-upper-east图片）
  'rongxinarc': '04-rongxinarc',               // 4-杭州融信
  'macalline-anji': '05-macalline-anji',       // 5-安吉度假别墅
  'upper-east': '06-prime-dynapolis',         // 6-品尊国际三期（使用06-prime-dynapolis图片）
  'moment-to-cloud': '07-moment-to-cloud',      // 7-开云艾尚里
  'lot-hk231': '08-lot-hk231',               // 8-新湖天虹
  'chairclub': '09-chairclub',                // 9-chairclub
  'content-office-shop': '10-content-office-shop', // 10-城市客厅
  'contentshow': '11-content-show',            // 11-滨江绿色廊道
};

function AllProjectsPage() {
  return (
    <div className="pt-32 pb-16 px-6 lg:px-10">
      {/* 瀑布流布局 - 2列，图片自然比例 */}
      <div className="columns-1 md:columns-2 gap-6">
        {projects.map(project => (
          <Link
            key={project.id}
            to={`/projects/${project.id}`}
            className="break-inside-avoid block group mb-6"
          >
            {/* 项目卡片 - 相对定位容器 */}
            <div className="relative overflow-hidden transition-transform hover:scale-[1.02]">
              {/* 图片 - 使用映射后的图片ID */}
              <img
                src={`/images/projects/${imageIdMap[project.id] || project.id}.jpg`}
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
