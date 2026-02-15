import { useParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { useCallback, useEffect, useRef, useState } from 'react';
import PictureImage from '../components/PictureImage';

export function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="min-h-screen bg-[#181818] flex items-center justify-center text-white">Project not found</div>;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);
  const transitionTimersRef = useRef([]);
  const images = project.gallery || [];
  const FADE_OUT_MS = 180;
  const FADE_TOTAL_MS = 420;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [id]);

  const clearTransitionTimers = useCallback(() => {
    transitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
    transitionTimersRef.current = [];
  }, []);

  const changeImageWithTransition = useCallback((direction) => {
    if (images.length <= 1 || isImageTransitioning) return;

    clearTransitionTimers();
    setIsImageTransitioning(true);

    const switchTimer = window.setTimeout(() => {
      setCurrentImageIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % images.length
          : (prev - 1 + images.length) % images.length
      );
    }, FADE_OUT_MS);

    const finishTimer = window.setTimeout(() => {
      setIsImageTransitioning(false);
    }, FADE_TOTAL_MS);

    transitionTimersRef.current.push(switchTimer, finishTimer);
  }, [FADE_OUT_MS, FADE_TOTAL_MS, clearTransitionTimers, images.length, isImageTransitioning]);

  const nextImage = useCallback(() => {
    changeImageWithTransition('next');
  }, [changeImageWithTransition]);

  const prevImage = useCallback(() => {
    changeImageWithTransition('prev');
  }, [changeImageWithTransition]);

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

  return (
    <div className="min-h-screen bg-[#181818]">
      {/* 主图片区域 - 撑满页面高度 */}
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <PictureImage
          imagePath={images[currentImageIndex]}
          alt={`${project.name} - Image ${currentImageIndex + 1}`}
          className={`block h-screen w-auto max-w-none mx-auto object-contain transition-all duration-[420ms] ease-out will-change-transform ${
            isImageTransitioning ? 'opacity-0 scale-[1.01]' : 'opacity-100 scale-100'
          }`}
        />

        {/* 项目名称和地点在图片左下角 */}
        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-2xl md:text-3xl font-normal tracking-wider text-white drop-shadow-lg mb-2">{project.name}</h2>
          <p className="text-base md:text-lg text-white/90 drop-shadow-md">{project.location}</p>
          <p className="text-sm text-white/70 uppercase tracking-wider">{project.statusLabel} · {project.categoryLabel}</p>
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
      </div>

      {/* 文字介绍区域 - 需要向下滚动查看 */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="space-y-4 text-white">
            <p><span className="text-white/70">Client:</span> {project.client}</p>
            {project.year && <p><span className="text-white/70">Year:</span> {project.year}</p>}
            {project.grossFloorArea && <p><span className="text-white/70">Area:</span> {project.grossFloorArea}</p>}
            {project.status && (
              <p>
                <span className="text-white/70">Status:</span>{' '}
                <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                  project.status === 'finalized' ? 'bg-green-500/30 text-green-300' :
                  project.status === 'under-construction' ? 'bg-yellow-500/30 text-yellow-300' :
                  'bg-gray-500/30 text-gray-300'
                }`}>
                  {project.statusLabel}
                </span>
              </p>
            )}
            {project.category && <p><span className="text-white/70">Category:</span> {project.categoryLabel}</p>}
          </div>

          {project.description && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/80 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;

