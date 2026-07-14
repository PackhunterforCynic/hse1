import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useCursor } from '../../context/CursorContext';

const OptimizedVideo = ({ src, poster }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { updateCursor, resetCursor } = useCursor();

  if (isPlaying) {
    return (
      <video
        src={src}
        controls
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div 
      className="relative w-full h-full cursor-none group"
      onClick={() => {
        setIsPlaying(true);
        resetCursor();
      }}
      onMouseEnter={() => updateCursor({ active: true, text: 'PLAY' })}
      onMouseLeave={resetCursor}
    >
      <img 
        src={poster || src} // If no poster is provided, browsers may struggle, but it's a fallback
        alt="Video thumbnail"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover filter brightness-[0.8] group-hover:brightness-100 transition-all duration-700"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-500">
          <Play fill="white" size={32} className="ml-2 text-white" />
        </div>
      </div>
    </div>
  );
};

export default function EditorialGallery({ media }) {
  const [visibleCount, setVisibleCount] = useState(4); // Start with 4 items
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!media || visibleCount >= media.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Load 4 more items when the loader comes into view
          setVisibleCount((prev) => Math.min(prev + 4, media.length));
        }
      },
      { rootMargin: '400px' } // Pre-load before it actually enters viewport
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

  // A helper function to assign specific grid column spans based on index
  // This creates the editorial rhythm the user asked for
  const getGridClass = (index) => {
    const pattern = index % 8;
    
    // Asymmetrical Editorial CSS Grid Rhythm
    switch (pattern) {
      case 0: return "col-span-12 md:col-span-8 row-span-2 aspect-[4/3] md:aspect-[16/9]"; // Large featured left
      case 1: return "col-span-12 md:col-span-4 row-span-1 aspect-[4/5]"; // Supporting right top
      case 2: return "col-span-12 md:col-span-4 row-span-1 aspect-[4/5]"; // Supporting right bottom
      case 3: return "col-span-12 md:col-span-12 row-span-2 aspect-video"; // Full width cinematic or video
      case 4: return "col-span-12 md:col-span-4 row-span-1 aspect-square"; // 3-col grid item 1
      case 5: return "col-span-12 md:col-span-4 row-span-1 aspect-square"; // 3-col grid item 2
      case 6: return "col-span-12 md:col-span-4 row-span-1 aspect-square"; // 3-col grid item 3
      case 7: return "col-span-12 md:col-span-12 row-span-2 aspect-[21/9]"; // Ultra wide
      default: return "col-span-12";
    }
  };

  return (
    <section className="w-full py-12 md:py-24 px-4 md:px-8 xl:px-12 mx-auto max-w-[1920px]">
      <div className="grid grid-cols-12 gap-4 md:gap-8 auto-rows-min">
        {visibleMedia.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`relative overflow-hidden bg-surface rounded-sm ${getGridClass(index)}`}
          >
            {item.type === 'video' ? (
              <OptimizedVideo src={item.src} poster={item.poster} />
            ) : (
              <img 
                src={item.src} 
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Invisible loader element for Intersection Observer */}
      {visibleCount < media.length && (
        <div ref={loaderRef} className="w-full h-24 flex items-center justify-center mt-12">
          {/* Optional: Add a subtle loading spinner here if desired, but user wants seamless infinite loading */}
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
}
