import { useParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { useCallback, useEffect, useRef, useState } from 'react';
import PictureImage from '../components/PictureImage';
import { formatDetailLabel, getCategoryLabel, getProjectDetailEntries, getProjectLocation, getProjectName, getStatusLabel, useLanguage } from '../i18n.jsx';

// Cloudflare Stream Video Player Component
function StreamVideoPlayer({ videoId, customerCode, title, thumbnailPath }) {
  // controls=true 显示默认控件：播放/暂停、进度条、音量、全屏
  // poster 需要完整的 URL，构造完整路径
  const getPosterUrl = () => {
    if (!thumbnailPath) return '';
    // 构造完整 URL（使用当前域名 + 路径 + .jpg）
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const fullPath = `${baseUrl}${thumbnailPath}.jpg`;
    return `&poster=${encodeURIComponent(fullPath)}`;
  };
  
  const src = `https://customer-${customerCode}.cloudflarestream.com/${videoId}/iframe?muted=true&preload=metadata&controls=true${getPosterUrl()}`;
  
  return (
    <div className="relative w-full bg-black rounded-sm overflow-hidden" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={src}
        title={title || 'Video'}
        className="absolute top-0 left-0 w-full h-full z-10"
        style={{ border: 'none' }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

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
  const navBarRef = useRef(null);
  // 合并所有类型的图片：建筑外观 -> 景观 -> 室内
  const allImages = [
    ...(project.gallery || []).map(path => ({ path, category: 'architecture', categoryLabel: lang === 'en' ? 'Architecture' : '建筑外观' })),
    ...(project.landscapeImages || []).map(path => ({ path, category: 'landscape', categoryLabel: lang === 'en' ? 'Landscape' : '景观' })),
    ...(project.interiorImages || []).map(path => ({ path, category: 'interior', categoryLabel: lang === 'en' ? 'Interior' : '室内' })),
  ];
  const videos = project.videos || [];
  const detailEntries = getProjectDetailEntries(project, lang);

  // Helper to get thumbnail path from full image path
  const getThumbPath = (fullPath) => {
    // /images/projects/one-park-gubei/01-one-park-gubei -> /images/projects/one-park-gubei/thumb-01-one-park-gubei
    const parts = fullPath.split('/');
    const filename = parts[parts.length - 1];
    parts[parts.length - 1] = 'thumb-' + filename;
    return parts.join('/');
  };

  // Check if this is a video project
  const hasVideos = videos.length > 0;
  const hasImages = allImages.length > 0;
  // For mixed projects, show videos first then images
  const displayItems = hasVideos
    ? [...videos.map(v => ({ ...v, type: 'video' })), ...allImages.map(item => ({ ...item, thumbPath: getThumbPath(item.path), type: 'image' }))]
    : allImages.map(item => ({ ...item, thumbPath: getThumbPath(item.path), type: 'image' }));
  const currentItem = displayItems[currentImageIndex] || null;
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
    if (displayItems.length <= 1 || isImageTransitioning || newIndex === currentImageIndex) return;

    clearTransitionTimers();
    // Direct image switch without fade-to-black transition
    setCurrentImageIndex(newIndex);
  }, [clearTransitionTimers, currentImageIndex, displayItems.length, isImageTransitioning]);

  const nextImage = useCallback(() => {
    const newIndex = (currentImageIndex + 1) % displayItems.length;
    changeImageWithTransition(newIndex);
  }, [changeImageWithTransition, currentImageIndex, displayItems.length]);

  const prevImage = useCallback(() => {
    const newIndex = (currentImageIndex - 1 + displayItems.length) % displayItems.length;
    changeImageWithTransition(newIndex);
  }, [changeImageWithTransition, currentImageIndex, displayItems.length]);

  useEffect(() => {
    return () => {
      clearTransitionTimers();
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, [clearTransitionTimers]);

  useEffect(() => {
    if (displayItems.length <= 1) return;

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
  }, [displayItems.length, nextImage, prevImage]);

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

  // 桌面端：鼠标移入底部触发区域
  const handleTriggerMouseEnter = () => {
    if (!isMobile) {
      setShowThumbnails(true);
    }
  };

  // 桌面端：鼠标离开缩略图导航栏区域
  const handleThumbnailsMouseLeave = () => {
    if (!isMobile) {
      setShowThumbnails(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181818]">
      {/* 主图片/视频区域 - 撑满页面高度 */}
      <div className="relative w-full bg-black overflow-hidden md:h-screen">
        {currentItem?.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center pb-20 md:pb-0">
            <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
              <StreamVideoPlayer
                videoId={currentItem.videoId}
                customerCode={currentItem.customerCode}
                title={currentItem.title || getProjectName(project, lang)}
                thumbnailPath={currentItem.thumbnail}
              />
            </div>
          </div>
        ) : (
          <PictureImage
            imagePath={currentItem?.path || images[currentImageIndex]}
            alt={`${getProjectName(project, lang)} - Image ${currentImageIndex + 1}`}
            className="block w-full h-auto object-contain md:h-screen md:w-auto md:max-w-none md:mx-auto"
          />
        )}

        {/* 项目名称和地点在图片左下角 */}
        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-2xl md:text-3xl font-normal tracking-wider text-white drop-shadow-lg mb-2">{getProjectName(project, lang)}</h2>
          <p className="text-base md:text-lg text-white/90 drop-shadow-md">{getProjectLocation(project, lang)}</p>
          <p className="text-sm text-white/70 uppercase tracking-wider">{getStatusLabel(project.status, lang)} · {getCategoryLabel(project.category, lang)}</p>
        </div>

        {/* 左右切换箭头 - 方形按钮略微缩小 */}
        {displayItems.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 z-30 w-12 h-12 rounded bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-sm"
            >
              &larr;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 z-30 w-12 h-12 rounded bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-sm"
            >
              &rarr;
            </button>
          </>
        )}

        {/* 移动端：底部透明触发带，用于展开/收起缩略图导航栏 */}
        {isMobile && displayItems.length > 1 && (
          <button
            type="button"
            aria-label={showThumbnails ? '收起缩略图导航栏' : '展开缩略图导航栏'}
            className="absolute bottom-0 left-16 right-16 z-30 h-14 bg-transparent md:hidden"
            onClick={() => setShowThumbnails(prev => !prev)}
          />
        )}

        {/* 底部触发区域和导航栏容器 */}
        {displayItems.length > 1 && (
          <div
            ref={navBarRef}
            className="absolute bottom-0 left-0 right-0 z-20"
            onMouseEnter={() => {
              if (!isMobile) setShowThumbnails(true);
            }}
            onMouseLeave={() => {
              if (!isMobile && showThumbnails) setShowThumbnails(false);
            }}
          >
            {/* 移动端展开/收起由底部透明触发带处理 */}

            {/* 缩略图导航栏 - 只对 transform 做过渡，避免 opacity 过渡干扰鼠标事件 */}
            <div
              className={`duration-300 ease-out ${
                showThumbnails
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
              style={{ transition: showThumbnails ? 'transform 300ms ease-out' : 'opacity 150ms ease-out, transform 300ms ease-out' }}
            >
              {/* 渐变遮罩背景 - 使用 mask 实现两端渐隐 */}
              <div
                className="bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-12 pb-4"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)'
                }}
              >
                {/* 居中的缩略图容器 */}
                <div className="mx-auto max-w-4xl px-8">
                  {/* 缩略图横向滚动容器 - 支持拖拽 */}
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

                      const onMouseMove = (moveEvent) => {
                        moveEvent.preventDefault();
                        const x = moveEvent.pageX - ele.offsetLeft;
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
                    {displayItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`flex-shrink-0 relative overflow-hidden transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-black/60 scale-105'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ width: '80px', height: '60px' }}
                      >
                        {item.type === 'video' ? (
                          <>
                            <img
                              src={item.thumbnail ? `${item.thumbnail}.jpg` : '/images/video-placeholder.jpg'}
                              alt={`Video ${index + 1}`}
                              className="w-full h-full object-cover pointer-events-none"
                              loading="lazy"
                              draggable={false}
                            />
                            {/* Video play icon overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                                <svg className="w-3 h-3 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 5.84a.5.5 0 01.77-.42l7.15 4.16a.5.5 0 010 .84l-7.15 4.16a.5.5 0 01-.77-.42V5.84z" />
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          <picture>
                            <source srcSet={`${item.thumbPath}.avif`} type="image/avif" />
                            <source srcSet={`${item.thumbPath}.webp`} type="image/webp" />
                            <img
                              src={`${item.thumbPath}.jpg`}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover pointer-events-none"
                              loading="lazy"
                              draggable={false}
                            />
                          </picture>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 图片/视频计数器 */}
                <div className="text-center mt-2">
                  <span className="text-white/70 text-sm">
                    {currentImageIndex + 1} / {displayItems.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 底部进度指示器 - 当缩略图隐藏时显示 */}
        {displayItems.length > 1 && !showThumbnails && (
          <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
            <div className="flex justify-center gap-1.5 pb-4">
              {displayItems.length <= 12 ? (
                displayItems.map((_, index) => (
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
                    {currentImageIndex + 1} / {displayItems.length}
                  </span>
                  <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white/80 transition-all duration-300"
                      style={{ width: `${((currentImageIndex + 1) / displayItems.length) * 100}%` }}
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
            {detailEntries
              .filter((entry) => {
                // 过滤掉"位置"条目（中英文）
                if (!entry.label) return true;
                const labelLower = entry.label.toLowerCase();
                return labelLower !== '位置' && labelLower !== 'location' && labelLower !== '项目位置' && labelLower !== 'project location';
              })
              .map((entry, index) => (
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
