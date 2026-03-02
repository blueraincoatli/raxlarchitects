import { useParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { useCallback, useEffect, useRef, useState } from 'react';
import PictureImage from '../components/PictureImage';
import { formatDetailLabel, getCategoryLabel, getProjectDetailEntries, getProjectLocation, getProjectName, getStatusLabel, useLanguage } from '../i18n.jsx';

export function ProjectDetailPage() {
  const { lang, t } = useLanguage();
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white">{t('detail.notFound')}</div>;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const transitionTimersRef = useRef([]);
  const thumbnailsRef = useRef(null);
  const images = project.gallery || [];
  const detailEntries = getProjectDetailEntries(project, lang);
  const FADE_OUT_MS = 180;
  const FADE_TOTAL_MS = 420;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  // 当图片切换时，自动滚动缩略图到可见区域
  useEffect(() => {
    if (thumbnailsRef.current && showThumbnails) {
      const thumbnailElements = thumbnailsRef.current.children;
      if (thumbnailElements[currentImageIndex]) {
        thumbnailElements[currentImageIndex].scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [currentImageIndex, showThumbnails]);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimersRef.current = [];
  }, []);

  const changeImageWithTransition = useCallback((newIndex) => {
    if (images.length <= 1 || isImageTransitioning || newIndex === currentImageIndex) return;

    clearTransitionTimers();
    setIsImageTransitioning(true);

    const switchTimer = window.setTimeout(() => {
      setCurrentImageIndex(newIndex);
    }, FADE_OUT_MS);

    const finishTimer = window.setTimeout(() => {
      setIsImageTransitioning(false);
    }, FADE_TOTAL_MS);

    transitionTimersRef.current.push(switchTimer, finishTimer);
  }, [FADE_OUT_MS, FADE_TOTAL_MS, clearTransitionTimers, currentImageIndex, images.length, isImageTransitioning]);

  const nextImage = useCallback(() => {
    const newIndex = (currentImageIndex + 1) % images.length;
    changeImageWithTransition(newIndex);
  }, [changeImageWithTransition, currentImageIndex, images.length]);

  const prevImage = useCallback(() => {
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    changeImageWithTransition(newIndex);
  }, [changeImageWithTransition, currentImageIndex, images.length]);

  useEffect(() => {
    return () => {
      clearTransitionTimers();
    };
  }, [clearTransitionTimers]);

  useEffect(() => {
    if (images.length <= 1) return;

    const onKeyDown = (event) => {
      const target = event.target;
      const tagName = target?.tagName;
      const isEditable =
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if (isEditable) return;

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        nextImage();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prevImage();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [images.length, nextImage, prevImage]);

  // 点击缩略图切换图片
  const handleThumbnailClick = (index) => {
    changeImageWithTransition(index);
  };

  return (
    <div className="min-h-screen bg-[#181818]">
      {/* 主图片区域 - 撑满页面高度 */}
      <div 
        className="relative w-full bg-black overflow-hidden md:h-screen"
        onMouseEnter={() => setShowThumbnails(true)}
        onMouseLeave={() => setShowThumbnails(false)}
        onTouchStart={() => setShowThumbnails(true)}
      >
        <PictureImage
          imagePath={images[currentImageIndex]}
          alt={`${getProjectName(project, lang)} - Image ${currentImageIndex + 1}`}
          className={`block w-full h-auto object-contain md:h-screen md:w-auto md:max-w-none md:mx-auto transition-all duration-[420ms] ease-out will-change-transform ${
            isImageTransitioning ? 'opacity-0 scale-[1.01]' : 'opacity-100 scale-100'
          }`}
        />

        {/* 项目名称和地点在图片左下角 */}
        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-2xl md:text-3xl font-normal tracking-wider text-white drop-shadow-lg mb-2">{getProjectName(project, lang)}</h2>
          <p className="text-base md:text-lg text-white/90 drop-shadow-md">{getProjectLocation(project, lang)}</p>
          <p className="text-sm text-white/70 uppercase tracking-wider">{getStatusLabel(project.status, lang)} · {getCategoryLabel(project.category, lang)}</p>
        </div>

        {/* 左右切换箭头 - 方形按钮略微缩小 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 z-10 w-12 h-12 rounded bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-sm"
            >
              &larr;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-10 w-12 h-12 rounded bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-sm"
            >
              &rarr;
            </button>
          </>
        )}

        {/* 缩略图导航栏 - 叠在大图底部 */}
        {images.length > 1 && (
          <div 
            className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ease-out ${
              showThumbnails ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            {/* 渐变遮罩背景 */}
            <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4">
              {/* 缩略图容器 */}
              <div 
                ref={thumbnailsRef}
                className="flex gap-2 px-4 overflow-x-auto scrollbar-hide pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {images.map((imagePath, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`flex-shrink-0 relative overflow-hidden rounded transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-white scale-105' 
                        : 'opacity-60 hover:opacity-90'
                    }`}
                    style={{ width: '80px', height: '60px' }}
                  >
                    <img
                      src={`${imagePath}.jpg`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
              
              {/* 图片计数器 */}
              <div className="text-center mt-2">
                <span className="text-white/70 text-sm">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 底部提示条 - 当缩略图隐藏时显示一个小指示器 */}
        {images.length > 1 && !showThumbnails && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            {/* 进度点指示器 */}
            <div className="flex justify-center gap-1.5 pb-4">
              {images.length <= 12 ? (
                // 图片较少时显示所有点
                images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'bg-white w-4' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))
              ) : (
                // 图片较多时显示简化指示器
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full">
                  <span className="text-white/80 text-xs">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                  <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/80 transition-all duration-300"
                      style={{ width: `${((currentImageIndex + 1) / images.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 文字介绍区域 - 需要向下滚动查看 */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="space-y-3 text-white/85 leading-relaxed">
            {detailEntries.map((entry, index) => (
              <p key={`${project.id}-detail-${index}`}>
                {entry.label ? (
                  <>
                    <span className="font-semibold tracking-wide text-white uppercase">{formatDetailLabel(entry.label, lang)}</span>
                    <span className="text-white/75"> {' : '} </span>
                    <span>{entry.value}</span>
                  </>
                ) : (
                  entry.text
                )}
              </p>
            ))}
            <p className="pt-2 border-t border-white/10">
              <span className="font-semibold tracking-wide text-white uppercase">{formatDetailLabel(t('detail.status'), lang)}</span>
              <span className="text-white/75"> {' : '} </span>
              <span className="text-white/85">{getStatusLabel(project.status, lang)}</span>
            </p>
            <p>
              <span className="font-semibold tracking-wide text-white uppercase">{formatDetailLabel(t('detail.category'), lang)}</span>
              <span className="text-white/75"> {' : '} </span>
              <span className="text-white/85">{getCategoryLabel(project.category, lang)}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
