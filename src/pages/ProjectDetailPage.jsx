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
  const [isMobile, setIsMobile] = useState(false);
  const transitionTimersRef = useRef([]);
  const thumbnailsRef = useRef(null);
  const hideTimerRef = useRef(null);
  const images = project.gallery || [];
  const detailEntries = getProjectDetailEntries(project, lang);
  const FADE_OUT_MS = 180;
  const FADE_TOTAL_MS = 420;
  const MOBILE_HIDE_DELAY = 400;

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
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
    
    // 移动端：点击后延迟自动隐藏导航栏
    if (isMobile && hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    if (isMobile) {
      hideTimerRef.current = window.setTimeout(() => {
        setShowThumbnails(false);
      }, MOBILE_HIDE_DELAY);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818]">
      {/* 主图片区域 - 撑满页面高度 */}
      <div className="relative w-full bg-black overflow-hidden md:h-screen">
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

        {/* 缩略图导航栏容器 - 底部悬停区域和缩略图一起 */}
        {images.length > 1 && (
          <div 
            className="absolute bottom-0 left-0 right-0 z-20"
            onMouseEnter={!isMobile ? () => setShowThumbnails(true) : undefined}
            onMouseLeave={!isMobile ? () => setShowThumbnails(false) : undefined}
            onTouchStart={isMobile ? () => setShowThumbnails(true) : undefined}
          >
            {/* 底部 1/3 透明触发区域 - 仅在缩略图隐藏时有效 */}
            {!showThumbnails && (
              <div className="h-[33vh] w-full" />
            )}

            {/* 缩略图导航栏 - 使用 mask 实现两端渐隐 */}
            <div 
              className={`transition-all duration-300 ease-out ${
                showThumbnails ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'
              }`}
            >
              {/* 渐变遮罩背景 - 固定高度，不撑开 */}
              <div 
                className="bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12 pb-4"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
                }}
              >
                {/* 居中的缩略图容器 */}
                <div className="mx-auto max-w-4xl px-8">
                  {/* 缩略图滚动容器 - 原生拖拽滚动 */}
                  <div 
                    ref={thumbnailsRef}
                    className="flex gap-3 overflow-x-auto cursor-grab active:cursor-grabbing py-2 px-4"
                    style={{ 
                      scrollbarWidth: 'none', 
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch'
                    }}
                    onMouseDown={(e) => {
                      const ele = e.currentTarget;
                      ele.style.cursor = 'grabbing';
                      const startX = e.pageX - ele.offsetLeft;
                      const scrollLeft = ele.scrollLeft;
                      
                      const onMouseMove = (e) => {
                        e.preventDefault();
                        const x = e.pageX - ele.offsetLeft;
                        const walk = (x - startX) * 1.5;
                        ele.scrollLeft = scrollLeft - walk;
                      };
                      
                      const onMouseUp = () => {
                        ele.style.cursor = 'grab';
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                      };
                      
                      document.addEventListener('mousemove', onMouseMove);
                      document.addEventListener('mouseup', onMouseUp);
                    }}
                  >
                    {images.map((imagePath, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`flex-shrink-0 relative overflow-hidden rounded transition-all duration-200 ${
                          index === currentImageIndex 
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-black/60 scale-105' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ width: '80px', height: '60px' }}
                      >
                        <img
                          src={`${imagePath}.jpg`}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                          loading="lazy"
                          draggable={false}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 图片计数器 */}
                <div className="text-center mt-2">
                  <span className="text-white/70 text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部进度指示器 - 当缩略图隐藏时显示 */}
        {images.length > 1 && !showThumbnails && (
          <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
            <div className="flex justify-center gap-1.5 pb-4">
              {images.length <= 12 ? (
                images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    className={`pointer-events-auto w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex 
                        ? 'bg-white w-4' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))
              ) : (
                <div className="pointer-events-auto flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full">
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
