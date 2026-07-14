import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import Magnetic from '../common/Magnetic';

export default function Showreel() {
  const sectionRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const [isMuted, setIsMuted] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["top bottom", "center center"]
  });

  const clipPath = useTransform(
    scrollYProgress, 
    [0, 1], 
    ['inset(20% 20% 20% 20% round 10px)', 'inset(0% 0% 0% 0% round 0px)']
  );

  const handleHover = () => updateCursor({ active: true, text: 'PLAY', blend: true });
  const handleLeave = () => resetCursor();

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-[70vh] md:min-h-screen py-24 flex items-center justify-center bg-bg overflow-hidden z-10">
      <motion.div 
        style={{ clipPath }}
        className="relative w-[95%] md:w-[90%] aspect-[9/16] md:aspect-video overflow-hidden cursor-none"
        onMouseEnter={handleHover}
        onMouseLeave={handleLeave}
      >
        {/* Mobile Video */}
        <video 
          src="/videos/show reel/Content Creation Praise Ayodeji.mp4"
          autoPlay 
          muted={isMuted}
          loop 
          playsInline
          className="object-cover w-full h-full md:hidden scale-105"
        />
        {/* Desktop Video */}
        <video 
          src="/videos/show reel/window_compressed.mp4"
          autoPlay 
          muted={isMuted}
          loop 
          playsInline
          className="object-cover w-full h-full hidden md:block scale-105"
        />
        
        {/* Subtle cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-c from-transparent to-black/30 pointer-events-none mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/20 transition-colors duration-1000 md:hover:bg-transparent pointer-events-none" />
        
        {/* Audio Toggle */}
        <div className="absolute bottom-6 right-6 z-10 cursor-none pointer-events-auto">
          <Magnetic strength={30}>
            <button 
              onClick={toggleMute}
              className="p-4 rounded-full bg-black/40 md:hover:bg-black/80 backdrop-blur-md text-white transition-all duration-300"
              onMouseEnter={() => updateCursor({ active: true, text: isMuted ? 'UNMUTE' : 'MUTE', blend: true })}
              onMouseLeave={handleHover}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              )}
            </button>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
