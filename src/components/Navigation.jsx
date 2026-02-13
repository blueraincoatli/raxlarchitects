import { Link, useLocation } from 'react-router-dom';

export function Navigation({ className = "" }) {
  const location = useLocation();

  return (
    <nav className={`px-6 lg:px-10 py-4 flex items-center justify-between ${className}`}>
      <Link to="/" className={`text-lg tracking-wider text-white hover:opacity-70 transition-opacity-300 ${location.pathname === "/" ? "text-white" : "text-gray-400"}`}>
        Home
      </Link>
      <Link to="/projects" className={`text-lg tracking-wider text-white hover:opacity-70 transition-opacity-300 ${location.pathname === "/projects" ? "text-white" : "text-gray-400"}`}>
        Projects
      </Link>
      <Link to="/about" className={`text-lg tracking-wider text-white hover:opacity-70 transition-opacity-300 ${location.pathname === "/about" ? "text-white" : "text-gray-400"}`}>
        About
      </Link>
      <Link to="/contact" className={`text-lg tracking-wider text-white hover:opacity-70 transition-opacity-300 ${location.pathname === "/contact" ? "text-white" : "text-gray-400"}`}>
        Contact
      </Link>
    </nav>
  );
}
