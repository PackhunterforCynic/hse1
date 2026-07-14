import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { useCursor } from '../context/CursorContext';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import AISearch from './AISearch';

export default function Navbar() {
  const { updateCursor, resetCursor } = useCursor();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) setScrolled(true);
    else setScrolled(false);
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

  const navLinks = ['Projects', 'Services', 'About', 'Contact'];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 1.5 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled && !menuOpen ? 'py-4 bg-bg/70 backdrop-blur-md' : 'py-8 bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link 
            id="nav-logo"
            to="/" 
            prefetch="intent"
            className="text-2xl font-display tracking-widest uppercase font-medium relative z-50 flex items-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => setMenuOpen(false)}
          >
            <motion.span
              animate={{ 
                opacity: [0.7, 1, 0.7], 
                textShadow: ["0px 0px 4px rgba(255,255,255,0)", "0px 0px 12px rgba(239,230,210,0.6)", "0px 0px 4px rgba(255,255,255,0)"] 
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              Havilah
            </motion.span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-12 text-sm font-sans uppercase tracking-widest relative z-50">
            {navLinks.map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                prefetch="intent"
                className="relative overflow-hidden group md:hover:text-accent transition-colors duration-300"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:-translate-y-full">
                  {item}
                </span>
                <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] md:group-hover:translate-y-0 text-accent">
                  {item}
                </span>
              </Link>
            ))}
            
            <button 
              onClick={() => setSearchOpen(true)}
              className="relative overflow-hidden group md:hover:text-accent transition-colors duration-300 ml-4 flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-label="Search Projects"
            >
              <Search size={18} />
            </button>
          </div>

          {/* Mobile Toggle & Search */}
          <div className="md:hidden flex items-center gap-6 relative z-50">
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-white hover:text-accent transition-colors"
            >
              <Search size={20} />
            </button>
            <button 
              className="relative w-8 h-8 flex flex-col justify-center items-center gap-2 cursor-none"
              onClick={() => setMenuOpen(!menuOpen)}
              onMouseEnter={() => updateCursor({ active: true, text: menuOpen ? 'CLOSE' : 'MENU' })}
              onMouseLeave={handleMouseLeave}
            >
              <span className={`block w-full h-[1px] bg-white transition-transform duration-500 ${menuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
              <span className={`block w-full h-[1px] bg-white transition-transform duration-500 ${menuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
            </button>
          </div>
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
            className="fixed inset-0 z-40 bg-bg flex flex-col justify-center px-6"
          >
            <div className="flex flex-col space-y-8 mt-16">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                  <Link
                    to={`/${item.toLowerCase()}`}
                    prefetch="intent"
                    className="text-6xl font-display uppercase tracking-tighter md:hover:text-accent transition-colors duration-300"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="absolute bottom-12 left-6 right-6 border-t border-white/10 pt-8 flex justify-between text-xs font-sans tracking-widest uppercase text-text/50"
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
}
