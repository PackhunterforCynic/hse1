import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';

export default function Lightbox({ isOpen, onClose, media, currentIndex, onNext, onPrev }) {
  const { resetCursor } = useCursor();

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      resetCursor(); // Disable custom cursor inside lightbox for standard interaction
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown, resetCursor]);

  if (!isOpen || !media || media.length === 0) return null;

  const currentItem = media[currentIndex];

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95
    })
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50 || velocity.x < -500) {
      onNext();
    } else if (swipe > 50 || velocity.x > 500) {
      onPrev();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex items-center justify-center"
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-50">
          <div className="text-white/50 font-mono text-xs tracking-widest">
            {currentIndex + 1} / {media.length}
          </div>
          <button 
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors p-2"
          >
            <X size={24} strokeWidth={1} />
          </button>
        </div>

        {/* Navigation Buttons (Desktop) */}
        <button 
          onClick={onPrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white z-50 p-4 transition-colors hidden md:block"
        >
          <ChevronLeft size={32} strokeWidth={1} />
        </button>
        <button 
          onClick={onNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white z-50 p-4 transition-colors hidden md:block"
        >
          <ChevronRight size={32} strokeWidth={1} />
        </button>

        {/* Media Container */}
        <div className="relative w-full max-w-[90vw] h-[80vh] flex items-center justify-center">
          <AnimatePresence initial={false} custom={1}>
            <motion.div
              key={currentIndex}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            >
              {currentItem.type === 'video' ? (
                <video 
                  src={currentItem.src}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain shadow-2xl"
                />
              ) : (
                <img 
                  src={currentItem.src} 
                  alt="" 
                  className="max-w-full max-h-full object-contain shadow-2xl"
                  draggable={false}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
