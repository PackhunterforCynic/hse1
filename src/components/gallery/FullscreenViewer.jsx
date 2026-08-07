import { useEffect, useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import ResponsiveImage from '../ResponsiveImage';
import { useCursor } from '../../context/CursorContext';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

export default function FullscreenViewer({ gallery, initialIndex, onClose, onIndexChange }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const { updateCursor, resetCursor } = useCursor();
  const [mounted, setMounted] = useState(false);
  
  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const previousFocus = useRef(null);
  
  const totalItems = gallery.length;
  const activeMedia = gallery[activeIndex];

  // Focus Trapping & Accessibility
  useEffect(() => {
    setMounted(true);
    previousFocus.current = document.activeElement;
    if (containerRef.current) {
      containerRef.current.focus();
    }
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
      if (previousFocus.current) previousFocus.current.focus();
    };
  }, []);

  const resetControlsTimer = useCallback(() => {
    setControlsVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', resetControlsTimer);
    window.addEventListener('touchstart', resetControlsTimer);
    resetControlsTimer();
    return () => {
      window.removeEventListener('mousemove', resetControlsTimer);
      window.removeEventListener('touchstart', resetControlsTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetControlsTimer]);

  const paginate = useCallback((newDirection) => {
    const newIndex = (activeIndex + newDirection + totalItems) % totalItems;
    setActiveIndex(newIndex);
    if (onIndexChange) onIndexChange(newIndex);
  }, [activeIndex, totalItems, onIndexChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') paginate(1);
    if (e.key === 'ArrowLeft') paginate(-1);
  }, [onClose, paginate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!mounted) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      ref={containerRef}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-2xl flex items-center justify-center outline-none"
      onClick={onClose}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center p-4 md:p-16"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {activeMedia.type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center relative max-w-[100vw] max-h-[100vh]">
              <video 
                src={activeMedia.url} 
                controls={controlsVisible}
                autoPlay 
                muted={isMuted}
                playsInline
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            </div>
          ) : (
            <ResponsiveImage 
              src={activeMedia.url} 
              priority={true}
              className="max-w-full max-h-full object-contain select-none shadow-2xl"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* UI Overlay */}
      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top Bar - ALWAYS VISIBLE */}
            <div className="fixed top-0 inset-x-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-[10000]">
              <div className="text-white/70 font-mono text-xs tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                {String(activeIndex + 1).padStart(2, '0')} <span className="mx-2 text-white/30">/</span> {String(totalItems).padStart(2, '0')}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors"
                aria-label="Close fullscreen"
                onMouseEnter={() => updateCursor({ active: true, text: 'CLOSE' })}
                onMouseLeave={resetCursor}
              >
                <X size={24} />
              </button>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-y-0 left-0 w-32 flex items-center justify-start pl-6">
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                className="pointer-events-auto p-4 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all transform hover:-translate-x-1"
                aria-label="Previous"
              >
                <ChevronLeft size={32} />
              </button>
            </div>
            
            <div className="absolute inset-y-0 right-0 w-32 flex items-center justify-end pr-6">
              <button 
                onClick={(e) => { e.stopPropagation(); paginate(1); }}
                className="pointer-events-auto p-4 bg-black/40 hover:bg-black/80 backdrop-blur-md rounded-full text-white/50 hover:text-white transition-all transform hover:translate-x-1"
                aria-label="Next"
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Bottom Bar (Mute Toggle for Videos) */}
            {activeMedia.type === 'video' && (
              <div className="absolute bottom-8 left-8 pointer-events-auto">
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-4 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body
  );
}
