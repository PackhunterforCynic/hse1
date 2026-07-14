import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { ChevronLeft, ChevronRight, Maximize2, Volume2, VolumeX, Play } from 'lucide-react';
import ResponsiveImage from '../ResponsiveImage';
import FullscreenViewer from './FullscreenViewer';

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

const staggerVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function CinematicGallery({ project }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();

  const activeMedia = project.gallery[activeIndex];
  const totalItems = project.gallery.length;

  const paginate = useCallback((newDirection) => {
    setActiveIndex((prev) => (prev + newDirection + totalItems) % totalItems);
  }, [totalItems]);

  // Preload next image logic (Performance optimization)
  useEffect(() => {
    const nextIndex = (activeIndex + 1) % totalItems;
    const nextMedia = project.gallery[nextIndex];
    if (nextMedia?.type === 'image') {
      const img = new Image();
      img.src = nextMedia.url;
    }
  }, [activeIndex, project.gallery, totalItems]);

  return (
    <section ref={containerRef} className="w-full py-12 md:py-24 px-4 md:px-8 xl:px-12 mx-auto max-w-[1920px]">
      <motion.div 
        className="flex flex-col xl:flex-row gap-8 xl:gap-12 w-full h-auto xl:h-[80vh]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        transition={{ staggerChildren: 0.1 }}
      >
        
        {/* Sticky Info Panel (Desktop Left / Mobile Top) */}
        <motion.div variants={staggerVariants} className="w-full xl:w-1/4 flex flex-col xl:sticky xl:top-24 h-auto xl:h-[calc(80vh-6rem)] shrink-0">
          <div className="mb-8">
            <h2 className="text-sm font-mono tracking-widest text-accent uppercase mb-4">Project Overview</h2>
            <h1 className="text-4xl md:text-5xl font-heading uppercase tracking-tighter mb-6">{project.title}</h1>
            <p className="text-lg md:text-xl font-light font-serif italic text-text/80 leading-relaxed">
              {project.story}
            </p>
          </div>

          <div className="space-y-6 mt-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono tracking-widest text-text/40 uppercase mb-1">Client</p>
                <p className="text-sm uppercase tracking-wider">{project.credits?.client || 'Internal'}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest text-text/40 uppercase mb-1">Category</p>
                <p className="text-sm uppercase tracking-wider">{project.category}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10">
              <p className="text-[10px] font-mono tracking-widest text-text/40 uppercase mb-3">Deliverables</p>
              <ul className="flex flex-wrap gap-2">
                {project.deliverables?.map((item, i) => (
                  <li key={i} className="text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full text-text/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Featured Media Viewer (Middle/Hero) */}
        <motion.div variants={staggerVariants} className="w-full xl:w-[60%] h-[50vh] md:h-[70vh] xl:h-full relative overflow-hidden rounded-xl md:rounded-[2rem] bg-black shadow-2xl group">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) paginate(1);
                else if (swipe > swipeConfidenceThreshold) paginate(-1);
              }}
            >
              {activeMedia.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video 
                    src={activeMedia.url} 
                    autoPlay 
                    loop 
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="absolute bottom-6 left-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              ) : (
                <ResponsiveImage 
                  src={activeMedia.url} 
                  priority={true}
                  className="w-full h-full object-cover pointer-events-none"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Viewer Overlay Controls */}
          <div className="absolute inset-0 flex justify-between items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
            <button onClick={() => paginate(-1)} className="pointer-events-auto h-full w-1/4 flex items-center justify-start pl-4 md:pl-8 outline-none focus-visible:ring-2 focus-visible:ring-accent" onMouseEnter={() => updateCursor({ active: true, text: 'PREV' })} onMouseLeave={resetCursor} aria-label="Previous Media">
               <div className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all transform hover:-translate-x-1">
                 <ChevronLeft size={24} />
               </div>
            </button>
            <button onClick={() => paginate(1)} className="pointer-events-auto h-full w-1/4 flex items-center justify-end pr-4 md:pr-8 outline-none focus-visible:ring-2 focus-visible:ring-accent" onMouseEnter={() => updateCursor({ active: true, text: 'NEXT' })} onMouseLeave={resetCursor} aria-label="Next Media">
               <div className="p-3 bg-black/20 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-all transform hover:translate-x-1">
                 <ChevronRight size={24} />
               </div>
            </button>
          </div>

          <button 
            onClick={() => setIsFullscreen(true)}
            className="absolute top-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onMouseEnter={() => updateCursor({ active: true, text: 'EXPAND' })}
            onMouseLeave={resetCursor}
            aria-label="View Fullscreen"
          >
            <Maximize2 size={20} />
          </button>
          
          {/* Progress Indicator */}
          <div className="absolute bottom-6 right-6 z-30 font-mono text-[10px] md:text-xs tracking-[0.2em] bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-white/70">
            {String(activeIndex + 1).padStart(2, '0')} / {String(totalItems).padStart(2, '0')}
          </div>
        </motion.div>

        {/* Thumbnail Rail (Desktop Right / Mobile Bottom) */}
        <motion.div variants={staggerVariants} className="w-full xl:w-[15%] h-auto xl:h-full flex xl:flex-col gap-3 md:gap-4 overflow-x-auto xl:overflow-y-auto snap-x xl:snap-y snap-mandatory scrollbar-hide py-2 xl:py-0 shrink-0">
          {project.gallery.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative flex-shrink-0 snap-center w-[30vw] md:w-[20vw] xl:w-full h-[120px] md:h-[160px] xl:h-[20vh] rounded-lg overflow-hidden transition-all duration-500 ease-out border outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isActive ? 'border-accent ring-2 ring-accent scale-[1.02] opacity-100' : 'border-white/5 opacity-50 hover:opacity-80 scale-95'
                }`}
                aria-label={`View media ${idx + 1}`}
                aria-current={isActive ? 'true' : 'false'}
                onMouseEnter={() => updateCursor({ active: true, text: 'VIEW' })}
                onMouseLeave={resetCursor}
              >
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors z-10" />
                {item.type === 'video' ? (
                  <>
                    <video src={item.url} className={`w-full h-full object-cover filter transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale'}`} />
                    <div className="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur px-2 py-1 rounded text-[8px] font-mono text-white/80 flex items-center gap-1">
                      <Play size={8} /> VIDEO
                    </div>
                  </>
                ) : (
                  <ResponsiveImage 
                    src={item.url}
                    sizes="(max-width: 1280px) 30vw, 15vw"
                    className={`w-full h-full object-cover filter transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale'}`}
                  />
                )}
                
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div 
                    layoutId="activeThumb"
                    className="absolute inset-x-0 bottom-0 h-1 bg-accent z-20" 
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </motion.div>

      {isFullscreen && (
        <FullscreenViewer 
          gallery={project.gallery}
          initialIndex={activeIndex}
          onClose={() => setIsFullscreen(false)}
          onIndexChange={setActiveIndex}
        />
      )}
    </section>
  );
}
