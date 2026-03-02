import { useState, useEffect } from 'react';
import { projects } from '../content/projects';
import { Link } from 'react-router-dom';
import { getProjectLocation, getProjectName, useLanguage } from '../i18n.jsx';

// 首页轮播图数据 - 支持桌面版和移动版
const homeSlides = [
  // 桌面版（横版）- 使用大图
  { id: 'desktop-1', image: '/images/home/01-gubei', type: 'desktop', project: 'one-park-gubei' },
  { id: 'desktop-2', image: '/images/home/02-gubei', type: 'desktop', project: 'one-park-gubei' },
  { id: 'desktop-3', image: '/images/home/03-gubei', type: 'desktop', project: 'one-park-gubei' },
  { id: 'desktop-4', image: '/images/home/04-huashan', type: 'desktop', project: 'royal-pavilion' },
  { id: 'desktop-5', image: '/images/home/05-huashan', type: 'desktop', project: 'royal-pavilion' },
  { id: 'desktop-6', image: '/images/home/06-huashan', type: 'desktop', project: 'royal-pavilion' },

  // 移动版（竖版）- 使用小图
  { id: 'mobile-1', image: '/images/home/m-01-gubei', type: 'mobile', project: 'one-park-gubei' },
  { id: 'mobile-2', image: '/images/home/m-02-gubei', type: 'mobile', project: 'one-park-gubei' },
  { id: 'mobile-3', image: '/images/home/m-03-gubei', type: 'mobile', project: 'one-park-gubei' },
  { id: 'mobile-4', image: '/images/home/m-04-huashan', type: 'mobile', project: 'royal-pavilion' },
  { id: 'mobile-5', image: '/images/home/m-05-huashan', type: 'mobile', project: 'royal-pavilion' },
  { id: 'mobile-6', image: '/images/home/m-06-huashan', type: 'mobile', project: 'royal-pavilion' },
];

function HomePage() {
  const { t, lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % getCurrentSlides().length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + getCurrentSlides().length) % getCurrentSlides().length);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // 检测是否移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
  }, []);

  // Auto-play
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % getCurrentSlides().length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const getCurrentSlides = () => {
    return isMobile ? homeSlides.filter(s => s.type === 'mobile') : homeSlides.filter(s => s.type === 'desktop');
  };

  const currentSlide = getCurrentSlides()[currentIndex];
  const currentProject = projects.find(p => p.id === currentSlide.project);

  // 图片回退机制：AVIF > WebP > JPG
  const getImageUrl = (slide) => {
    return slide.image;  // 不添加扩展名，让 <picture> 元素处理
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

      <div className="relative h-full flex items-center">
        {getCurrentSlides().map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: index === currentIndex ? 'translateX(0)' :
                     index < currentIndex ? 'translateX(-100%)' : 'translateX(100%)'
            }}
          >
            <picture>
              <source srcSet={`${slide.image}.avif`} type="image/avif" />
              <source srcSet={`${slide.image}.webp`} type="image/webp" />
              <img
                src={`${slide.image}.jpg`}
                alt={slide.project ? projects.find(p => p.id === slide.project)?.name : currentSlide.project}
                className="h-screen w-full object-cover"
              />
            </picture>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        {currentProject ? (
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-normal tracking-wider text-white mb-2">{getProjectName(currentProject, lang)}</h2>
            <p className="text-lg md:text-xl text-white/90 mb-6">{getProjectLocation(currentProject, lang)}</p>
            <Link
              to={`/projects/${currentProject.id}`}
              className="inline-block px-6 py-2 border border-white/50 text-white hover:bg-white hover:text-gray-900 transition-colors text-sm tracking-wide"
            >
              {t('common.viewProject')}
            </Link>
          </div>
        ) : (
          <p className="text-white/60">{t('common.loading')}</p>
        )}
      </div>

      {/* 左箭头 */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 z-50 text-white/80 hover:text-white transition-colors text-4xl cursor-pointer"
      >
        &larr;
      </button>

      {/* 右箭头 */}
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 z-50 text-white/80 hover:text-white transition-colors text-4xl cursor-pointer"
      >
        &rarr;
      </button>

      {/* 小圆点指示器 */}
      <div className="absolute bottom-8 left-1/2 right-1/2 flex justify-center gap-2 z-10">
        {getCurrentSlides().map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;

