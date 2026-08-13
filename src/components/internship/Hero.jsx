import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useLanguage } from '../../i18n';
import GsapButton from '../common/GsapButton';

const fadeUpVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function Hero({ onApply }) {
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-primary">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 filter grayscale mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-transparent to-bg" />
      
      {/* Decorative SVGs: Cinematic & Growth Elements */}
      
      {/* 1. Clapperboard */}
      <motion.svg 
        animate={{ rotate: [-5, 5, -5], y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-24 left-[10%] w-16 h-16 text-white/10 hidden md:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1"
      >
        <path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
        <path d="M2 10h20"></path>
        <path d="M6 3l4 7"></path>
        <path d="M14 3l4 7"></path>
      </motion.svg>

      {/* 2. Video Camera */}
      <motion.svg 
        animate={{ rotate: [0, -10, 0], y: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-1/3 right-[15%] w-20 h-20 text-accent/15 hidden md:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1"
      >
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </motion.svg>

      {/* 3. Studio Light / Spotlight */}
      <motion.svg 
        animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 left-[20%] w-24 h-24 text-white/5 hidden lg:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1"
      >
        <path d="M12 2v4"></path>
        <path d="M12 18v4"></path>
        <path d="M4.93 4.93l2.83 2.83"></path>
        <path d="M16.24 16.24l2.83 2.83"></path>
        <path d="M2 12h4"></path>
        <path d="M18 12h4"></path>
        <path d="M4.93 19.07l2.83-2.83"></path>
        <path d="M16.24 7.76l2.83-2.83"></path>
        <circle cx="12" cy="12" r="4"></circle>
      </motion.svg>

      {/* 4. Growth / Chart Arrow */}
      <motion.svg 
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[20%] right-[10%] w-16 h-16 text-accent/20 hidden lg:block" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
      >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </motion.svg>

      {/* 5. Walking Steps / Journey */}
      <div className="absolute top-[60%] left-[5%] hidden md:flex flex-col gap-4 opacity-10">
        {[0, 1, 2].map((i) => (
          <motion.svg 
            key={i}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 1, ease: "linear" }}
            className={`w-8 h-8 text-white ${i % 2 === 0 ? 'ml-0' : 'ml-6'}`} 
            viewBox="0 0 24 24" 
            fill="currentColor"
            style={{ transform: 'rotate(-45deg)' }}
          >
            <ellipse cx="12" cy="8" rx="3" ry="5" />
            <circle cx="12" cy="2" r="2" />
          </motion.svg>
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto mt-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
          className="flex flex-col items-center"
        >
          <motion.span variants={fadeUpVariant} className="text-accent font-mono uppercase tracking-widest text-sm mb-6">
            {t('internship.subtitle') || "Join the creative force"}
          </motion.span>
          <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl lg:text-9xl font-display uppercase tracking-tighter mb-8 leading-[0.9]">
            {t('navigation.internship') || "Havilah Internship"}
          </motion.h1>
          <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-white/70 max-w-2xl mb-12 font-sans font-light">
            We are looking for passionate, driven creatives to join our studio. Gain real-world experience, mentorship, and work on Exciting Projects.
          </motion.p>
          <div className="mt-4" onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}>
            <GsapButton 
              variant="primary"
              onClick={() => {
                const elem = document.getElementById('open-opportunities');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else if (onApply) {
                  onApply();
                }
              }}
              className="px-10 md:px-14 py-5 text-xs md:text-sm font-semibold tracking-widest uppercase"
            >
              {t('viewOpportunities') || "View Available Opportunities ↓"}
            </GsapButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
