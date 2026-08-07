import { useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useLanguage } from '../../i18n';
import GsapButton from '../common/GsapButton';
import GsapScrollReveal from '../common/GsapScrollReveal';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const wordVariants = {
  hidden: { y: '110%', rotateZ: 2, opacity: 0 },
  visible: { y: '0%', rotateZ: 0, opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

export default function ServicesPreview() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();

  const services = [
    t('servicesList.brandStrategy') || "Brand Strategy",
    t('servicesList.visualIdentity') || "Visual Identity",
    t('servicesList.filmProduction') || "Film Production",
    t('servicesList.photography') || "Photography",
    t('servicesList.videoEditing') || "Video Editing",
    t('servicesList.socialMedia') || "Social Media Marketing",
    t('servicesList.creativeCampaigns') || "Creative Campaigns"
  ];

  const handleHover = () => updateCursor({ active: true, text: 'EXPLORE', blend: true });
  const handleLeave = () => resetCursor();

  return (
    <section ref={containerRef} className="py-32 px-4 md:px-12 bg-white/5 backdrop-blur-md w-full relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 justify-between items-start">
        
        {/* Left Side text */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-32 mb-12 lg:mb-0">
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent mb-8">{t('home.expertise') || "Expertise"}</h2>
          <GsapScrollReveal mode="text" className="text-3xl md:text-4xl font-serif italic font-light leading-relaxed mb-10">
            {t('home.expertiseDesc') || "A unified approach to visual storytelling. From brand inception to final cut."}
          </GsapScrollReveal>
          <GsapButton to="/services" variant="primary">
            {t('navigation.services') || "Services"} →
          </GsapButton>
        </div>

        {/* Right Side list */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {services.map((service, idx) => (
            <GsapScrollReveal key={idx} mode="card" tiltStrength={6} delay={idx * 0.06}>
              <Link 
                to="/services"
                className="group relative px-6 py-8 bg-[#0C1220]/60 md:hover:bg-[#151E32]/90 rounded-xl border border-white/10 md:hover:border-[#CFA65B]/50 flex items-center justify-between cursor-none transition-all duration-300 shadow-lg"
                onMouseEnter={handleHover}
                onMouseLeave={handleLeave}
              >
                <div className="overflow-hidden">
                  <span className="inline-block text-2xl md:text-4xl font-heading uppercase tracking-tight text-white/70 md:group-hover:text-white md:group-hover:translate-x-3 transition-all duration-300 ease-out">
                    <GradientShimmer gradient="tonic" duration={2}>{service}</GradientShimmer>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 md:group-hover:bg-[#CFA65B] flex items-center justify-center text-accent md:group-hover:text-[#0C1220] font-bold transition-all duration-300 transform md:group-hover:scale-110">
                  ↗
                </div>
              </Link>
            </GsapScrollReveal>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

