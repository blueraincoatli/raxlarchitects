import { useState, useEffect } from 'react';
import { projects } from '../content/projects';
import { Link } from 'react-router-dom';

export function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const currentProject = projects[currentIndex];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

      <div className="relative h-full flex items-center">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: index === currentIndex ? 'translateX(0)' :
                     index < currentIndex ? 'translateX(-100%)' : 'translateX(100%)'
            }}
          >
            <img
              src={project.gallery[0]}
              alt={project.name}
              className="h-screen w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute top-8 left-8 z-20">
        <h1 className="text-3xl font-normal tracking-widest text-white">RA Architects</h1>
      </div>

      <div className="absolute bottom-20 left-8 z-20">
        <h2 className="text-3xl font-normal tracking-wider text-white mb-2">{currentProject.name}</h2>
        <p className="text-lg text-white/90">{currentProject.location}</p>
        <Link
          to={`/projects/${currentProject.id}`}
          className="inline-block mt-4 px-6 py-2 border border-white/50 text-white hover:bg-white hover:text-gray-900 transition-colors"
        >
          View Project -&gt;
        </Link>
      </div>

      <div className="absolute bottom-8 left-8 right-8 z-10 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
        >
          &larr;
        </button>
        <button
          onClick={togglePause}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white text-lg"
        >
          {isPaused ? '&#9658;' : '&#10074;&#10074;'}
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
        >
          &rarr;
        </button>
        <div className="flex gap-2 ml-4">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
