import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '/images/logo.png';
import { projects } from '../content/projects';
import { getProjectLocation, getProjectName, useLanguage } from '../i18n.jsx';

function Navigation({ className = "" }) {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const { lang, setLang, t } = useLanguage();

  const navItems = [
    { path: '/', label: t('nav.home') },
    {
      path: '/projects',
      linkPath: '/all-projects',
      label: t('nav.projects'),
      hasSubmenu: true,
      submenu: [
        {group: t('nav.statusGroup'), items: [
          { label: t('nav.finalized'), path: '/projects?status=finalized' },
          { label: t('nav.underConstruction'), path: '/projects?status=under-construction' },
          { label: t('nav.proposed'), path: '/projects?status=proposed' },
        ]},
        { group: t('nav.categoryGroup'), items: [
          { label: t('nav.architecture'), path: '/projects?category=architecture' },
          { label: t('nav.interior'), path: '/projects?category=interior' },
          { label: t('nav.landscape'), path: '/projects?category=landscape' },
        ]},
      ]
    },
    {
      path: '/about',
      label: t('nav.about'),
      hasSubmenu: true,
      submenu: [
        { label: t('nav.aboutUs'), path: '/about' },
        { label: t('nav.partners'), path: '/about?tab=partners' },
        { label: t('nav.awards'), path: '/about?tab=awards' },
      ]
    },
    { path: '/contact', label: t('nav.contact') },
  ];

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const searchResults = useMemo(() => {
    const source = normalizedSearchTerm
      ? projects.filter((project) => {
          const haystack = [
            project.id,
            project.name,
            getProjectName(project, 'en'),
            project.location,
            getProjectLocation(project, 'en'),
          ].join(' ').toLowerCase();
          return haystack.includes(normalizedSearchTerm);
        })
      : projects;

    return source.slice(0, 12);
  }, [normalizedSearchTerm]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const timerId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timerId);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isSearchOpen]);

  return (
    <>
      <nav className={`absolute top-0 left-0 right-0 z-50 px-4 md:px-6 lg:px-10 py-4 flex items-center justify-between transition-colors duration-300 hover:bg-black/30 ${className}`}>
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="RA Architects" className="h-7 md:h-8 w-auto" />
        </Link>
        <div className="hidden md:flex items-center gap-6">
        {navItems.map(item => (
          item.hasSubmenu ? (
            <div
              key={item.path}
              className="relative"
              onMouseEnter={() => setActiveMenu(item.path)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {item.linkPath ? (
                <Link
                  to={item.linkPath}
                  className={`text-lg tracking-wider text-white/80 hover:text-white transition-opacity-300 ${
                    location.pathname === item.path || location.pathname === item.linkPath ? "text-white" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`text-lg tracking-wider text-white/80 hover:text-white transition-opacity-300 cursor-pointer ${
                  location.pathname === item.path ? "text-white" : ""
                }`}>
                  {item.label}
                </span>
              )}

              {/* 子菜单 */}
              {activeMenu === item.path && (
                <div className="absolute top-full left-0">
                  {/* 透明桥接区域 - 填补导航栏到菜单的间隙 */}
                  <div className="absolute -top-4 left-0 right-0 h-4" />
                  {/* Projects: 分组显示 | About: 垂直列表显示 */}
                  <div className="mt-4">
                    {item.submenu[0]?.group ? (
                      /* Projects 分组样式 - 带背景容器 */
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg py-2 min-w-[200px] overflow-hidden">
                        {item.submenu.map(group => (
                          <div key={group.group} className="mb-2 last:mb-0">
                            <div className="px-4 py-1 text-xs text-white/50 uppercase tracking-wider">
                              {group.group}
                            </div>
                            {group.items.map((subItem, idx) => (
                              <Link
                                key={idx}
                                to={subItem.path}
                                className="block px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* About 垂直列表样式 - 带背景容器 */
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg py-3 min-w-[160px] overflow-hidden">
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
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="text-lg tracking-wider text-white/70 hover:text-white transition-opacity-300"
        >
          {t('nav.search')}
        </button>
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          className="text-lg tracking-wider text-white/70 hover:text-white transition-opacity-300"
        >
          {t('nav.langToggle')}
        </button>
        </div>

        <button
          type="button"
          className="md:hidden text-white/90 text-sm tracking-wider border border-white/30 px-3 py-1 rounded"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          MENU
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[65] md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/65" />
          <div
            className="absolute top-0 right-0 h-full w-[82vw] max-w-[360px] bg-[#181818] border-l border-white/15 p-5 overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-white text-sm tracking-wider">MENU</span>
              <button
                type="button"
                className="text-white/70 text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.close')}
              </button>
            </div>

            <div className="space-y-3">
              {navItems.map((item) => (
                <div key={`mobile-${item.path}`} className="border-b border-white/10 pb-3">
                  {!item.hasSubmenu ? (
                    <Link
                      to={item.path}
                      className="block text-white/90 tracking-wider"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full text-left text-white/90 tracking-wider"
                        onClick={() => setMobileOpenGroup((prev) => (prev === item.path ? null : item.path))}
                      >
                        {item.label}
                      </button>
                      {mobileOpenGroup === item.path && (
                        <div className="mt-2 pl-3 space-y-2">
                          {item.submenu[0]?.group
                            ? item.submenu.flatMap((group) => group.items).map((subItem, idx) => (
                                <Link
                                  key={`mobile-sub-${item.path}-${idx}`}
                                  to={subItem.path}
                                  className="block text-white/75 text-sm"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))
                            : item.submenu.map((subItem, idx) => (
                                <Link
                                  key={`mobile-sub-${item.path}-${idx}`}
                                  to={subItem.path}
                                  className="block text-white/75 text-sm"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="text-white/85 text-sm tracking-wider"
              >
                {t('nav.search')}
              </button>
              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
                className="text-white/85 text-sm tracking-wider"
              >
                {t('nav.langToggle')}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm px-4 py-24 md:py-28" onClick={() => setIsSearchOpen(false)}>
          <div
            className="max-w-4xl mx-auto bg-[#181818] border border-white/15 rounded-lg overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/10">
              <h2 className="text-white text-lg md:text-xl tracking-wide">{t('common.searchProjects')}</h2>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="text-white/70 hover:text-white text-sm"
              >
                {t('common.close')}
              </button>
            </div>

            <div className="p-5 md:p-6">
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="w-full h-11 bg-black/40 border border-white/20 rounded px-3 text-white outline-none focus:border-white/45"
              />

              <div className="mt-4 max-h-[55vh] overflow-auto pr-1">
                {!normalizedSearchTerm && (
                  <p className="text-white/60 text-sm">{t('common.searchHint')}</p>
                )}

                {normalizedSearchTerm && searchResults.length === 0 && (
                  <p className="text-white/60 text-sm">{t('common.searchNoResults')}</p>
                )}

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((project) => (
                      <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchTerm('');
                        }}
                        className="block px-3 py-3 rounded border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <p className="text-white text-sm md:text-base">{getProjectName(project, lang)}</p>
                        <p className="text-white/65 text-xs md:text-sm mt-1">{getProjectLocation(project, lang)}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navigation;

