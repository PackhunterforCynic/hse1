import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n';

export default function Testimonials() {
  const containerRef = useRef(null);
  const { t } = useLanguage();

  return (
    <section ref={containerRef} className="py-32 px-4 md:px-12 bg-primary w-full min-h-[50vh] flex items-center justify-center text-center">
      <motion.div 
        className="max-w-4xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <h3 className="text-3xl md:text-5xl font-light leading-snug font-serif italic text-white/90 mb-8">
          {t('home.testimonialQuote') || "\"Havilah didn't just capture our vision—they elevated it into something truly unforgettable. Their understanding of cinematic language is unmatched.\""}
        </h3>
        <p className="text-sm font-mono tracking-[0.2em] uppercase text-accent">
          {t('home.testimonialAuthor') || "— Sarah Jenkins, Creative Director"}
        </p>
      </motion.div>
    </section>
  );
}
