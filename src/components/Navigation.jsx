import { Link, useLocation } from 'react-router-dom';
import logo from '/images/logo.png';

function Navigation({ className = "" }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between transition-colors duration-300 hover:bg-black/30 ${className}`}>
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="RA Architects" className="h-8 w-auto" />
      </Link>
      <div className="flex gap-6">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-lg tracking-wider text-white hover:opacity-70 transition-opacity-300 ${
              location.pathname === item.path ? "text-white" : "text-white/60"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
