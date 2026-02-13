import { useParams, Link } from 'react-router-dom';
import { projects } from '../content/projects';
import { useState } from 'react';

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
      <Link to="/projects" className="fixed top-4 left-4 z-50 text-white hover:opacity-70 transition-opacity-300 flex items-center gap-2">
        <span className="text-xl">&larr;</span>
        <span>Back to Projects</span>
      </Link>

      <div className="pt-16 pb-8 px-4">
        <div className="relative max-w-6xl mx-auto mb-8">
          <div className="relative bg-black/20 rounded-2xl overflow-hidden">
            <img
              src={images[currentImageIndex]}
              alt={`${project.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[70vh] object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  &larr;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
                >
                  &rarr;
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentImageIndex === index ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-black/30 backdrop-blur-sm rounded-2xl p-8">
          <h1 className="text-3xl font-normal tracking-wider text-white mb-4">{project.name}</h1>

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
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-white/80 leading-relaxed">{project.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
