import { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router';
import { useCursor } from '../context/CursorContext';
import { useLanguage } from '../i18n';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import AISearch from './AISearch';
import NavbarLogo from './common/NavbarLogo';
import LanguageSelector from './common/LanguageSelector';
import { useResponsive } from '../hooks/useResponsive';

const Navbar = memo(function Navbar() {
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();
  const { width } = useResponsive();
  
  // Dynamically determine if we need the compact/drawer navigation based on available width
  // 900px is roughly the threshold where our current nav links start getting cramped
  const isCompact = width < 950;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 50;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  });

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const handleMouseEnter = () => updateCursor({ active: true, text: '' });
  const handleMouseLeave = () => resetCursor();

  const navLinks = [
    { key: 'projects', path: '/projects', label: t('navigation.projects') },
    { key: 'services', path: '/services', label: t('navigation.services') },
    { key: 'internship', path: '/internship', label: t('navigation.internship') },
    { key: 'about', path: '/about', label: t('navigation.about') },
    { key: 'contact', path: '/contact', label: t('navigation.contact') }
  ];

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 1.6 }}
        className={`fixed top-0 left-0 w-full z-50 py-5 transition-all duration-500 ease-in-out ${
          scrolled && !menuOpen ? 'bg-primary/90 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link 
            id="nav-logo"
            to="/" 
            prefetch="intent"
            className="text-2xl font-display tracking-widest uppercase font-medium relative z-50 flex items-center shrink-0 mr-4"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setMenuOpen(false)}
          >
            <NavbarLogo />
          </Link>
          
          {/* Desktop Nav (Only shown if !isCompact) */}
          {!isCompact && (
            <div className="flex items-center space-x-5 xl:space-x-10 text-xs xl:text-sm font-sans uppercase tracking-widest relative z-50 shrink-0">
              {navLinks.map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  prefetch="intent"
                  className="relative overflow-hidden group md:hover:text-accent transition-colors duration-300"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:-translate-y-full">
                    {item.label}
                  </span>
                  <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:translate-y-0 text-accent">
                    {item.label}
                  </span>
                </Link>
              ))}
              
              <button 
                onClick={() => setSearchOpen(true)}
                className="relative overflow-hidden group md:hover:text-accent transition-colors duration-300 ml-2 flex items-center justify-center min-w-[44px] min-h-[44px] shrink-0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={t('navigation.search')}
              >
                <Search size={18} />
              </button>

              <LanguageSelector isMobile={false} />
            </div>
          )}

          {/* Drawer Toggle & Controls (Shown if isCompact) */}
          {isCompact && (
            <div className="flex items-center gap-2 sm:gap-3 relative z-50 shrink-0">
              <LanguageSelector isMobile={false} />
              
              <button 
                onClick={() => setSearchOpen(true)}
                className="text-white hover:text-accent transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t('navigation.search')}
              >
                <Search size={20} />
              </button>
              <button 
                className="relative min-w-[44px] min-h-[44px] flex flex-col justify-center items-center gap-2 ml-1 cursor-none"
                onClick={() => setMenuOpen(!menuOpen)}
                onMouseEnter={() => updateCursor({ active: true, text: menuOpen ? 'CLOSE' : 'MENU' })}
                onMouseLeave={handleMouseLeave}
              >
                <span className={`block w-full h-[1px] bg-white transition-transform duration-500 ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
                <span className={`block w-full h-[1px] bg-white transition-transform duration-500 ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
              </button>
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-primary flex flex-col justify-center px-6"
          >
            <div className="flex flex-col space-y-6 mt-12">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.key}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Link
                    to={item.path}
                    prefetch="intent"
                    className="text-3xl md:text-4xl font-display uppercase tracking-[0.05em] md:hover:text-accent transition-colors duration-300 block"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="pt-4"
              >
                <LanguageSelector isMobile={true} />
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute bottom-12 left-6 right-6 border-t border-white/10 pt-8 flex justify-between text-xs font-sans tracking-widest uppercase text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <span>Bangalore, India</span>
              <span>Say Hello</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AISearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
});

export default Navbar;
