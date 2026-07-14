import { useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

const services = [
  "Brand Strategy",
  "Visual Identity",
  "Film Production",
  "Photography",
  "Video Editing",
  "Social Media Marketing",
  "Creative Campaigns"
];

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

  const handleHover = () => updateCursor({ active: true, text: 'EXPLORE', blend: true });
  const handleLeave = () => resetCursor();

  return (
    <section ref={containerRef} className="py-32 px-4 md:px-12 bg-surface w-full relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 justify-between items-start">
        
        {/* Left Side text */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-32 mb-12 lg:mb-0">
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-accent mb-8">Expertise</h2>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-4xl font-serif italic font-light leading-relaxed"
          >
            A unified approach to visual storytelling. From brand inception to final cut.
          </motion.p>
        </div>

        {/* Right Side list */}
        <motion.div 
          className="w-full lg:w-1/2 flex flex-col"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {services.map((service, idx) => (
            <Link 
              key={idx}
              to="/services"
              className="group relative py-8 border-b border-white/10 last:border-none flex items-center justify-between cursor-none overflow-hidden"
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              <div className="overflow-hidden">
                <motion.span 
                  variants={wordVariants}
                  className="inline-block origin-top-left text-4xl md:text-5xl font-heading uppercase tracking-tight text-text/50 md:group-hover:text-text md:group-hover:translate-x-4 transition-all duration-500 ease-out"
                >
                  {service}
                </motion.span>
              </div>
              <span className="text-accent opacity-100 translate-x-0 md:opacity-0 md:-translate-x-4 md:group-hover:translate-x-0 md:group-hover:opacity-100 transition-all duration-500 ease-out">
                →
              </span>
            </Link>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
