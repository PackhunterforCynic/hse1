import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../i18n';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { AnimatedTestimonials } from '../ui/animated-testimonials';

// Unsplash fallback images
const fallbacks = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop"
];

export default function Testimonials({ testimonials = [] }) {
  const containerRef = useRef(null);
  const { t } = useLanguage();

  const formattedTestimonials = testimonials.map((t, index) => ({
    name: t.clientName,
    designation: `${t.designation || 'Client'}${t.company ? ` at ${t.company}` : ''}`,
    quote: t.review,
    src: t.profilePhoto || fallbacks[index % fallbacks.length],
  }));

  return (
    <section ref={containerRef} className="py-32 bg-primary w-full min-h-[50vh] flex flex-col items-center justify-center relative overflow-hidden">
      
      {testimonials.length > 0 ? (
        <AnimatedTestimonials testimonials={formattedTestimonials} autoplay={true} />
      ) : (
        <motion.div 
          className="max-w-4xl mx-auto flex flex-col items-center text-center px-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <div className="relative h-80 w-full max-w-sm mb-12 rounded-3xl overflow-hidden border border-white/10">
             <img src={fallbacks[0]} alt="Default Client" className="w-full h-full object-cover" />
          </div>
          <h3 className="text-3xl md:text-5xl font-light leading-snug font-serif italic text-white/90 mb-8">
            {t('home.testimonialQuote') || "\"Havilah didn't just capture our vision—they elevated it into something truly unforgettable. Their understanding of cinematic language is unmatched.\""}
          </h3>
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-accent">
            {t('home.testimonialAuthor') || "— Sarah Jenkins, Creative Director"}
          </p>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 z-10"
      >
        <Link 
          to="/submit-testimonial" 
          className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] text-white/70 text-xs font-mono uppercase tracking-widest rounded-full transition-all"
        >
          Write a Review <ArrowRight size={14} />
        </Link>
      </motion.div>
    </section>
  );
}
