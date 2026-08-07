import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import { useLanguage } from '../../i18n';
import GsapButton from '../common/GsapButton';
import GsapScrollReveal from '../common/GsapScrollReveal';
import { GradientShimmer } from '@/components/ui/gradient-shimmer';

export default function ContactCTA() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();
  const { t } = useLanguage();

  const handleHover = () => updateCursor({ active: true, text: 'TALK' });
  const handleLeave = () => resetCursor();

  return (
    <section ref={containerRef} className="py-40 px-4 md:px-12 bg-white/5 backdrop-blur-md w-full flex items-center justify-center text-center border-t border-white/5 relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl lg:text-[6vw] font-heading font-bold tracking-tighter uppercase leading-tight mb-12 flex flex-col items-center">
          <GsapScrollReveal mode="text" className="inline-block origin-top-left justify-center pb-2">
            <GradientShimmer gradient="sunrise" duration={2.2}>{t('home.ctaTitle1') || "Got a story worth telling —"}</GradientShimmer>
          </GsapScrollReveal>
          <GsapScrollReveal mode="text" delay={0.2} className="inline-block origin-top-left justify-center text-accent italic font-serif lowercase font-light pb-2">
            <GradientShimmer gradient="bubble" duration={2.5}>{t('home.ctaTitle2') || "and worth growing?"}</GradientShimmer>
          </GsapScrollReveal>
        </h2>
        
        <div onMouseEnter={handleHover} onMouseLeave={handleLeave}>
          <GsapButton to="/contact" variant="primary" strength={60} className="text-sm sm:text-base px-12 py-6">
            {t('home.startConversation') || "Start Conversation"} ↗
          </GsapButton>
        </div>
      </div>
    </section>
  );
}

