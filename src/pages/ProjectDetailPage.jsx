import { useParams } from 'react-router-dom';
import { projects } from '../content/projects';
import { useState } from 'react';
import PictureImage from '../components/PictureImage';

export function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Project not found</div>;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = project.gallery || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* 图片容器 - 使用 flex 居中，保持图片比例 */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <PictureImage
          imagePath={images[currentImageIndex]}
          alt={`${project.name} - Image ${currentImageIndex + 1}`}
          className="max-h-full max-w-full object-contain"
        />

        {/* 项目名在图片左下角 */}
        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-2xl md:text-3xl font-normal tracking-wider text-white drop-shadow-lg mb-2">{project.name}</h2>
          <p className="text-base md:text-lg text-white/90 drop-shadow-md">{project.location}</p>
          <p className="text-sm text-white/70 uppercase tracking-wider">{project.statusLabel} · {project.categoryLabel}</p>
        </div>

        {/* 左右切换箭头 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-8 top-1/2 z-10 w-14 h-14 rounded bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-xl"
            >
              &larr;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-8 top-1/2 z-10 w-14 h-14 rounded bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors text-xl"
            >
              &rarr;
            </button>
          </>
        )}
      </div>

      {/* 文字介绍区域 - 需要向下滚动查看 */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-normal tracking-wider text-white mb-8">{project.name}</h1>

          <div className="space-y-4 text-white/90">
            <p className="text-lg text-white">{project.location}</p>
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
            {project.category && <p> <span className="text-white/70">Category:</span> {project.categoryLabel}</p>}
          </div>

          {project.description && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-white/80 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>
    </div>
  );
}

export default ProjectDetailPage;
