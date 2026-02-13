import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '/images/logo.png';

function Navigation({ className = "" }) {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);

  const navItems = [
    { path: '/', label: 'Home' },
    {
      path: '/projects',
      label: 'Projects',
      hasSubmenu: true,
      submenu: [
        { group: 'status', items: [
          { label: 'Finalized Project', filter: 'finalized' },
          { label: 'Under Construction', filter: 'under-construction' },
          { label: 'Proposed Project', filter: 'proposed' },
        ]},
        { group: 'category', items: [
          { label: 'Architecture', filter: 'architecture' },
          { label: 'Interior', filter: 'interior' },
          { label: 'Landscape', filter: 'landscape' },
        ]},
      ]
    },
    {
      path: '/about',
      label: 'About',
      hasSubmenu: true,
      submenu: [
        { label: 'About Us', path: '/about' },
        { label: 'Partners', path: '/about?tab=partners' },
        { label: 'Awards', path: '/about?tab=awards' },
      ]
    },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className={`absolute top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4 flex items-center justify-between transition-colors duration-300 hover:bg-black/30 ${className}`}>
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="RA Architects" className="h-8 w-auto" />
      </Link>
      <div className="flex gap-6">
        {navItems.map(item => (
          item.hasSubmenu ? (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => setActiveMenu(item.path)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <span className={`text-lg tracking-wider text-white/80 hover:text-white transition-opacity-300 cursor-pointer ${
                location.pathname === item.path ? "text-white" : ""
              }`}>
                {item.label}
              </span>

              {/* 子菜单 */}
              {activeMenu === item.path && (
                <div className="absolute top-full left-0">
                  {/* 透明桥接区域 */}
                  <div className="absolute -top-px left-0 right-0 h-px" />
                  {/* Projects: 分组显示 | About: 垂直列表显示 */}
                  <div className={`mt-2 ${item.submenu[0]?.group ? 'bg-black/70 backdrop-blur-sm rounded-lg py-2 min-w-[200px]' : 'bg-black/70 backdrop-blur-sm rounded-lg py-3 min-w-[160px]'}`}>
                    {item.submenu[0]?.group ? (
                      /* Projects 分组样式 */
                      <div>
                        {item.submenu.map(group => (
                          <div key={group.group} className="mb-2 last:mb-0">
                            <div className="px-4 py-1 text-xs text-white/50 uppercase tracking-wider">
                              {group.group}
                            </div>
                            {group.items.map((subItem, idx) => (
                              <Link
                                key={idx}
                                to={`${item.path}?filter=${subItem.filter}`}
                                className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* About 垂直列表样式 */
                      <div className="bg-black/70 backdrop-blur-sm rounded-lg py-3 min-w-[160px]">
                        {item.submenu.map((subItem, idx) => (
                          <Link
                            key={idx}
                            to={subItem.path}
                            className="block px-6 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.path}
              to={item.path}
              className={`text-lg tracking-wider text-white hover:opacity-70 transition-opacity-300 ${
                location.pathname === item.path ? "text-white" : "text-white/60"
              }`}
            >
              {item.label}
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
