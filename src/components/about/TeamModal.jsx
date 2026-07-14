import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useEffect } from 'react';

export default function TeamModal({ member, isOpen, onClose }) {
  const { updateCursor, resetCursor } = useCursor();

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && member && (
        <motion.div
          key="team-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-none"
            onClick={onClose}
            onMouseEnter={() => updateCursor({ active: true, text: 'CLOSE' })}
            onMouseLeave={resetCursor}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ rotateY: -90, scale: 0.8, opacity: 0 }}
            animate={{ rotateY: 0, scale: 1, opacity: 1 }}
            exit={{ rotateY: 90, scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{ transformPerspective: 1200 }}
            className="relative z-10 w-full max-w-5xl bg-surface border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row h-[80vh] md:h-[600px]"
          >
            {/* Close Button Mobile */}
            <button 
              className="md:hidden absolute top-4 right-4 z-20 text-white mix-blend-difference"
              onClick={onClose}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>

            {/* Left: Image */}
            <div className="w-full h-1/2 md:h-full md:w-1/2 overflow-hidden">
              <motion.img 
                initial={{ scale: 1.1, filter: 'grayscale(100%) blur(4px)' }}
                animate={{ scale: 1, filter: 'grayscale(0%) blur(0px)' }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
                src={member.image} 
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Content */}
            <div className="w-full h-1/2 md:h-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto">
              <h3 className="text-4xl md:text-5xl font-heading uppercase tracking-tight mb-2">{member.name}</h3>
              <p className="text-sm font-mono tracking-widest text-accent uppercase mb-8">{member.role}</p>
              
              <div className="flex-grow">
                <p className="text-base md:text-lg font-sans font-light leading-relaxed text-text/80 mb-8">
                  {member.fullBio}
                </p>
                
                <div className="mb-8">
                  <h4 className="text-xs font-mono tracking-widest uppercase text-text/50 mb-4">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-sans rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-6 border-t border-white/10 pt-6 mt-auto">
                {member.socials.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-mono uppercase tracking-widest text-text/60 hover:text-accent transition-colors cursor-none"
                    onMouseEnter={() => updateCursor({ active: true, text: 'VISIT' })}
                    onMouseLeave={resetCursor}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
