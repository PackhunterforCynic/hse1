import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePreloader } from '../context/PreloaderContext';
import Aperture from './Aperture';

export default function Preloader() {
  const { loading, setLoading } = usePreloader();
  const [phase, setPhase] = useState('initial'); 
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!loading) return;

    // Check if intro has already played this session
    const hasPlayed = sessionStorage.getItem('havilah-intro-played');
    if (hasPlayed) {
      setLoading(false);
      return;
    }
    
    // Cinematic preloader sequence (~2.5s total)
    const timer1 = setTimeout(() => setPhase('opening'), 400); 
    const timer2 = setTimeout(() => setPhase('reading'), 1200); 
    const timer3 = setTimeout(() => setPhase('flying'), 1800); 
    const timer4 = setTimeout(() => {
      setPhase('done');
      setLoading(false);
      sessionStorage.setItem('havilah-intro-played', 'true');
    }, 2500); 
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [loading, setLoading]);

  if (!loading) return null;

  const isVisible = phase === 'initial' || phase === 'opening' || phase === 'reading' || phase === 'flying';
  const isRevealing = phase === 'opening' || phase === 'reading' || phase === 'flying';
  const isFlying = phase === 'flying';

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white overflow-hidden pointer-events-none"
    >
      {/* Background Film Grain - Optimized */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-screen z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      {/* Cinematic Lens Flare */}
      <motion.div 
        className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
        initial={{ opacity: 0, x: "-100%", scale: 0.8 }}
        animate={{ 
          opacity: phase === 'opening' || phase === 'reading' ? [0, 0.4, 0] : 0, 
          x: phase === 'opening' || phase === 'reading' ? ["-100%", "100%"] : "-100%",
          scale: 1
        }}
        transition={{ duration: 1.5, ease: "linear", delay: 0.2 }}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)',
          width: '200vw',
          height: '2px',
          filter: 'blur(8px) brightness(1.5)',
          top: '50%',
          transform: 'translateY(-50%) rotate(-15deg)'
        }}
      />

      {/* Brand Identity Wrapper */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className="text-4xl md:text-7xl lg:text-[5vw] tracking-[0.4em] font-display uppercase ml-[0.4em] text-white origin-center"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ 
            opacity: isRevealing ? 1 : 0, 
            scale: isFlying ? (isMobile ? 0.45 : 0.35) : (isRevealing ? 1 : 0.9), 
            filter: "blur(0px)",
            y: isFlying ? (isMobile ? "-42vh" : "-44vh") : 0,
            x: isFlying ? (isMobile ? "-30vw" : "-38vw") : 0
          }}
          transition={{ 
            duration: isFlying ? 0.6 : 0.8, 
            ease: [0.76, 0, 0.24, 1],
            delay: isRevealing && !isFlying ? 0.2 : 0
          }}
        >
          HAVILAH
        </motion.div>
        
        <motion.div 
          className="mt-6 text-xs md:text-base font-serif italic font-light tracking-[0.2em] text-white/70 uppercase md:normal-case"
          initial={{ opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ 
            opacity: phase === 'opening' ? 0.8 : 0, 
            y: phase === 'opening' ? 0 : (phase === 'initial' ? 10 : 0), 
            filter: "blur(0px)" 
          }}
          transition={{ 
            duration: phase === 'reading' || phase === 'flying' ? 0.3 : 0.8, 
            ease: [0.76, 0, 0.24, 1],
            delay: phase === 'opening' ? 0.4 : 0
          }}
        >
          Stories that move. Brands that endure.
        </motion.div>
      </div>

      {/* Mechanical Aperture Overlay */}
      <Aperture phase={phase} />
    </motion.div>
  );
}
