import { useState } from 'react';
import { projects } from '../content/projects';
import { Link } from 'react-router-dom';

export function ProjectsPage() {
  const [filterCategory, setFilterCategory] = useState('');

  const filteredProjects = projects.filter(project => {
    if (filterCategory && project.category !== filterCategory) return false;
    return true;
  });

  const categoryFilters = [
    { key: '', label: '全部' },
    { key: 'architecture', label: '建筑' },
    { key: 'landscape', label: '景观' },
    { key: 'interior', label: '室内' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#0a0a0a]">
      <section className="sticky top-16 z-40 bg-[#0a0a0a]/95 backdrop-blur-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 px-4">
          {categoryFilters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setFilterCategory(filter.key)}
              className={`px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors ${
                filterCategory === filter.key ? 'bg-white text-gray-900' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 px-6 py-8">
        {filteredProjects.map(project => (
          <div key={project.id} className="break-inside-avoid mb-4 relative group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={project.gallery[0]}
                alt={project.name}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 z-10">
                <h3 className="text-lg font-normal tracking-wider text-white uppercase">{project.name}</h3>
                <p className="text-sm text-white/90 opacity-80">{project.location}</p>
              </div>
              <Link
                to={`/projects/${project.id}`}
                className="absolute inset-0 z-20 hover:bg-white/20 transition-colors"
              >
                <span className="absolute top-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity text-2xl">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
