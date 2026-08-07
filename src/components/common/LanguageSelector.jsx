import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../../i18n';
import { useCursor } from '../../context/CursorContext';

export default function LanguageSelector({ isMobile = false }) {
  const { language, setLanguage, languages, t } = useLanguage();
  const { updateCursor, resetCursor } = useCursor();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Auto-close on click outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <div ref={containerRef} className={`relative z-50 inline-block ${isMobile ? 'mt-4' : 'ml-4'}`}>
      <button
        onClick={handleToggle}
        onMouseEnter={() => updateCursor({ active: true, text: 'LANG' })}
        onMouseLeave={resetCursor}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={t('navigation.selectLanguage')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 md:hover:bg-white/10 border border-white/15 md:hover:border-accent/60 text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
          isMobile ? 'text-base py-2 px-4 border-white/30 text-white' : 'text-white/90 md:hover:text-accent'
        }`}
      >
        <Globe size={isMobile ? 18 : 15} className="shrink-0 animate-pulse" />
        <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label={t('navigation.selectLanguage')}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: isMobile ? -10 : 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isMobile ? -10 : 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute ${
              isMobile ? 'bottom-full mb-3 left-0' : 'top-full right-0 mt-3'
            } w-64 sm:w-72 max-w-[calc(100vw-32px)] py-2 bg-[#0d0d0d]/98 backdrop-blur-2xl border border-white/20 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-[100] flex flex-col overflow-hidden pointer-events-auto`}
          >
            <div className="px-4 py-2 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-white/50 flex justify-between items-center shrink-0">
              <span>{t('navigation.selectLanguage')}</span>
              <span className="text-accent font-bold">({languages.length})</span>
            </div>
            <div 
              className="max-h-[300px] overflow-y-auto divide-y divide-white/5 custom-scrollbar overscroll-contain pointer-events-auto"
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {languages.map((lang) => {
                const isSelected = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    role="menuitem"
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => handleSelect(lang.code)}
                    onMouseEnter={() => updateCursor({ active: true, text: lang.native })}
                    onMouseLeave={resetCursor}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-sans tracking-wide transition-colors ${
                      isSelected
                        ? 'bg-white/15 text-accent font-semibold'
                        : 'text-white/80 md:hover:bg-white/10 md:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      <span className="text-sm shrink-0">{lang.flag}</span>
                      <span className="font-mono truncate">{lang.name}</span> 
                      <span className="text-white/40 text-[10px] font-sans shrink-0">({lang.native})</span>
                    </span>
                    {isSelected && <Check size={14} className="text-accent shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
