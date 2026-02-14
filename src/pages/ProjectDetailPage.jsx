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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* 主图片区域 - 撑满页面高度 */}
      <div className="relative h-screen w-full">
        <PictureImage
          imagePath={images[currentImageIndex]}
          alt={`${project.name} - Image ${currentImageIndex + 1}`}
          className="h-screen w-full object-cover"
        />

        {/* 左右切换箭头放到页面左右两端 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-0 top-1/2 z-10 w-16 h-16 rounded-full bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              &larr;
            </button>
            <button
              onClick={nextImage}
              className="absolute right-0 top-1/2 z-10 w-16 h-16 rounded-full bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            >
              &rarr;
            </button>
          </>
        )}

        {/* 项目名在图片左下角 */}
        <div className="absolute bottom-8 left-8 z-10">
          <h2 className="text-2xl md:text-3xl font-normal tracking-wider text-white drop-shadow-lg mb-2">{project.name}</h2>
          <p className="text-base md:text-lg text-white/90 drop-shadow-md">{project.location}</p>
          <p className="text-sm text-white/70 uppercase tracking-wider">{project.statusLabel} · {project.categoryLabel}</p>
        </div>
      </div>

      {/* 文字介绍 - 需要向下滚动查看 */}
      <div className="relative z-10 -mt-32">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <h1 className="text-3xl md:text-4xl font-normal tracking-wider text-white mb-6">{project.name}</h1>

          <div className="space-y-3 text-white/90">
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
