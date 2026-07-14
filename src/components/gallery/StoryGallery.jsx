import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';
import Lightbox from './Lightbox';
import ResponsiveImage from '../common/ResponsiveImage';

const OptimizedVideo = ({ src, poster, isActive, onPlay }) => {
  const { updateCursor, resetCursor } = useCursor();

  if (isActive) {
    return (
      <video
        src={src}
        controls
        autoPlay
        playsInline
        className="w-full h-auto object-cover shadow-2xl"
      />
    );
  }

  return (
    <div 
      className="relative w-full h-full cursor-none group"
      onClick={(e) => {
        // Play video and notify parent to pause others
        e.stopPropagation();
        onPlay();
        resetCursor();
      }}
      onMouseEnter={() => updateCursor({ active: true, text: 'PLAY' })}
      onMouseLeave={resetCursor}
    >
      <video 
        src={src} 
        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
        <div className="w-16 h-16 rounded-full bg-accent/90 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
          <Play className="text-bg ml-1" size={24} fill="currentColor" />
        </div>
      </div>
    </div>
  );
};

export default function StoryGallery({ media }) {
  const [visibleCount, setVisibleCount] = useState(11); // Load one full narrative sequence initially
  const loaderRef = useRef(null);
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  useEffect(() => {
    if (!media || visibleCount >= media.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Load the next full sequence (11 items)
          setVisibleCount((prev) => Math.min(prev + 11, media.length));
        }
      },
      { rootMargin: '800px' } // Pre-load far in advance
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [media, visibleCount]);

  if (!media || media.length === 0) return null;

  const visibleMedia = media.slice(0, visibleCount);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <section className="w-full py-12 md:py-24 px-4 md:px-8 mx-auto max-w-7xl">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {visibleMedia.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative break-inside-avoid"
            >
              {item.type === 'video' ? (
                <OptimizedVideo 
                  src={item.src} 
                  poster={item.poster} 
                  isActive={activeVideoIndex === index}
                  onPlay={() => setActiveVideoIndex(index)}
                />
              ) : (
                <div 
                  className="cursor-zoom-in group overflow-hidden bg-[#0a0a0a]"
                  onClick={() => openLightbox(index)}
                >
                  <ResponsiveImage 
                    src={item.src} 
                    className="w-full h-auto object-contain transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-[1.02]"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {visibleCount < media.length && (
          <div ref={loaderRef} className="w-full h-32 flex items-center justify-center mt-12">
            <div className="w-8 h-8 border border-white/10 border-t-white/40 rounded-full animate-spin"></div>
          </div>
        )}
      </section>

      {/* Cinematic Fullscreen Lightbox */}
      <Lightbox 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        media={media}
        currentIndex={lightboxIndex}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % media.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + media.length) % media.length)}
      />
    </>
  );
}
