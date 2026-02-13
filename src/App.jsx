import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { projects } from './content/projects';
import { Navigation } from './components/Navigation';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <footer className="mt-auto py-8 text-center text-sm text-white/60 border-t border-white/10">
          <p>© 2025 RA Architects. All rights reserved.</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
