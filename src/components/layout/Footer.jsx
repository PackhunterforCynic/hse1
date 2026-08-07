import { Link } from 'react-router';
import { useCursor } from '../../context/CursorContext';
import { useLanguage } from '../../i18n';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const { updateCursor, resetCursor } = useCursor();
  const { t, formatDate } = useLanguage();

  const handleHover = () => updateCursor({ active: true, text: 'VISIT' });
  const handleLeave = () => resetCursor();

  return (
    <footer className="w-full bg-primary py-16 px-4 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
        
        {/* Brand */}
        <div className="flex flex-col">
          <Link 
            to="/" 
            className="text-5xl md:text-6xl font-display tracking-widest uppercase cursor-none"
            onMouseEnter={() => updateCursor({ active: true, text: 'HOME' })}
            onMouseLeave={handleLeave}
          >
            <motion.span
              animate={{ 
                opacity: [0.7, 1, 0.7], 
                textShadow: ["0px 0px 4px rgba(255,255,255,0)", "0px 0px 16px rgba(239,230,210,0.8)", "0px 0px 4px rgba(255,255,255,0)"] 
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              HAVILAH
            </motion.span>
          </Link>
          <p className="mt-4 text-white/60 font-serif italic text-lg tracking-wide">
            {t('footer.tagline')}
          </p>
        </div><div>
            <p className="text-xs font-mono tracking-widest uppercase text-white/50 mb-2">{t('footer.locationLabel')}</p>
            <p className="font-sans text-lg whitespace-pre-line">{t('footer.locationAddress')}</p>
          </div>

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div className="flex flex-col gap-4">
            {[
              { path: '/projects', label: t('navigation.projects') },
              { path: '/services', label: t('navigation.services') },
              { path: '/about', label: t('navigation.about') },
              { path: '/contact', label: t('navigation.contact') }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-sm font-mono tracking-widest uppercase text-white/80 md:hover:text-accent transition-colors duration-300 cursor-none"
                onMouseEnter={() => updateCursor({ active: true, text: 'GO' })}
                onMouseLeave={handleLeave}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-4">
            <a href="https://www.instagram.com/thepraiseayodeji" className="flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-white/80 md:hover:text-accent transition-colors duration-300 cursor-none" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              Instagram
            </a>
            <a href="https://www.youtube.com/@hsedigitals" className="flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-white/80 md:hover:text-accent transition-colors duration-300 cursor-none" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              YouTube
            </a>
            <a href="https://wa.me/917204042538?text=Hi%20Havilah!%20I%20would%20like%20to%20discuss%20a%20project%20with%20you." className="flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-white/80 md:hover:text-accent transition-colors duration-300 cursor-none" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              WhatsApp
            </a>
            <a href="mailto:hello@havilah.com" className="flex items-center gap-3 text-sm font-mono tracking-widest uppercase text-white/80 md:hover:text-accent transition-colors duration-300 cursor-none" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              <Mail size={16} /> Email
            </a>
          </div>
        </div>
      </div>
      
      
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-mono tracking-widest uppercase text-white/30">
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        <p className="mt-4 md:mt-0">{t('footer.slogan')}</p>
      </div>
    </footer>
  );
}
