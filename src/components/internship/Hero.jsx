import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useLanguage } from '../../i18n';
import GsapButton from '../common/GsapButton';
import InternshipHero3D from './InternshipHero3D';

const fadeUpVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function Hero({ onApply }) {
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();

  return (
    <div className="relative w-full h-[100vh] overflow-hidden flex items-end pb-32 justify-center bg-[#070707]">
      {/* 3D Hero Scene */}
      <InternshipHero3D />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 pointer-events-none mix-blend-overlay" />
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full pointer-events-none">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
          }}
          className="flex flex-col items-center w-full"
        >
          <motion.p variants={fadeUpVariant} className="text-sm md:text-base text-white/50 max-w-xl mb-10 font-mono tracking-widest uppercase text-center">
            {t('internship.subtitle') || "We are looking for passionate creatives to join our studio."}
          </motion.p>
          
          <div className="pointer-events-auto" onMouseEnter={() => updateCursor({ active: true })} onMouseLeave={resetCursor}>
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
              className="px-10 md:px-14 py-4 md:py-5 text-xs md:text-sm font-semibold tracking-widest uppercase bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-colors"
            >
              {t('viewOpportunities') || "View Available Opportunities ↓"}
            </GsapButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
