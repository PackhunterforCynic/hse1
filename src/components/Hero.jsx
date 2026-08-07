import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Button from './Button';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { useCursor } from '../context/CursorContext';
import { usePreloader } from '../context/PreloaderContext';
import { useLanguage } from '../i18n';
import Magnetic from './common/Magnetic';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function Hero() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const { loading } = usePreloader();
  const { t } = useLanguage();
  
  const isInView = useInView(containerRef);

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  const handleVideoHover = () => updateCursor({ active: true, text: 'PLAY', blend: true });
  const handleVideoLeave = () => resetCursor();
  const handleButtonHover = () => updateCursor({ active: true, text: '' }); // Magnetic dot

  // Stagger variants for the sequence
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  };

  const wordVariants = {
    hidden: { y: '110%', rotateZ: 2, opacity: 0 },
    visible: { y: '0%', rotateZ: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
  };

  const fadeUpVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section ref={containerRef} className="relative w-full min-h-[100dvh] md:h-screen overflow-hidden bg-black flex flex-col pt-16 md:pt-0 pb-16 md:pb-0">
      {/* Video Background */}
      <div 
        className="relative md:absolute md:inset-0 w-full aspect-video md:aspect-auto md:h-full shrink-0"
        onMouseEnter={handleVideoHover}
        onMouseLeave={handleVideoLeave}
      >
        <motion.video 
          ref={videoRef}
          src="/videos/Havilah-Hero.mp4"
          preload="auto"
          fetchPriority="high"
          autoPlay 
          muted
          loop 
          playsInline
          initial={{ scale: 1.1, filter: 'brightness(0.3)' }}
          animate={!loading ? { scale: 1.01, filter: 'brightness(0.6)' } : {}}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="object-cover w-full h-full transform origin-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-transparent to-bg hidden md:block pointer-events-none" />
        <div className="absolute -bottom-[2px] left-0 right-0 h-3/4 bg-gradient-to-t from-black via-black/60 to-transparent md:hidden pointer-events-none" />
      </div>

      {/* Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={!loading ? "visible" : "hidden"}
        className="relative z-10 flex-1 flex flex-col items-center justify-center w-full px-4 text-center py-8 md:py-0 pointer-events-none"
      >
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-[7vw] font-display uppercase leading-tight md:leading-none flex flex-wrap justify-center max-w-6xl mx-auto pointer-events-auto">
          {t('hero.title').split(' ').map((word, i) => (
            <span key={i} className="overflow-hidden inline-block pb-4 -mb-4 mr-[1.5vw]">
              <motion.span variants={wordVariants} className="block origin-bottom-left">
                <GradientShimmer gradient="sunrise" duration={2.2}>{word}</GradientShimmer>
              </motion.span>
            </span>
          ))}
        </h1>
        
        {/* Subtitle */}
        <div className="mt-6 md:mt-10 max-w-2xl text-center flex flex-col gap-4 pointer-events-auto">
          <motion.p variants={fadeUpVariants} className="text-base md:text-lg font-serif italic text-white/90">
            {t('hero.subtitle')}
          </motion.p>
          <motion.p variants={fadeUpVariants} className="text-sm font-mono tracking-[0.2em] uppercase text-accent/80">
            <GradientShimmer gradient="tonic" duration={1.8}>We shoot it. We shape it. We scale it.</GradientShimmer>
          </motion.p>
        </div>

        {/* CTAs */}
        <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-6 mt-12 font-mono pointer-events-auto">
          <Magnetic strength={40}>
            <div className="inline-block" onMouseEnter={handleButtonHover} onMouseLeave={resetCursor}>
              <Link to='/projects'><Button variant="primary">{t('navigation.projects')}</Button></Link>
            </div>
          </Magnetic>
          <Magnetic strength={40}>
            <div className="inline-block" onMouseEnter={handleButtonHover} onMouseLeave={resetCursor}>
              <Link to='/contact'><Button variant="outline">{t('navigation.contact')}</Button></Link>
            </div>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={!loading ? { opacity: 0.5 } : {}}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}
