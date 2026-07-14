import { useRef } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import Magnetic from '../common/Magnetic';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const wordVariants = {
  hidden: { y: '110%', rotateZ: 2, opacity: 0 },
  visible: { y: '0%', rotateZ: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const fadeUpVariant = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function ContactCTA() {
  const containerRef = useRef(null);
  const { updateCursor, resetCursor } = useCursor();

  const handleHover = () => updateCursor({ active: true, text: 'TALK' });
  const handleLeave = () => resetCursor();

  return (
    <section ref={containerRef} className="py-40 px-4 md:px-12 bg-surface w-full flex items-center justify-center text-center border-t border-white/5 relative z-10">
      <motion.div 
        className="max-w-5xl mx-auto flex flex-col items-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20%" }}
      >
        <h2 className="text-4xl md:text-6xl lg:text-[6vw] font-heading font-bold tracking-tighter uppercase leading-tight mb-12 flex flex-col items-center">
          <span className="overflow-hidden inline-block pb-2 mb-2">
            <motion.span variants={wordVariants} className="inline-block origin-top-left">Got a story worth telling —</motion.span>
          </span>
          <span className="overflow-hidden inline-block pb-2">
            <motion.span variants={wordVariants} className="inline-block origin-top-left text-accent italic font-serif lowercase font-light">and worth growing?</motion.span>
          </span>
        </h2>
        
        <motion.div variants={fadeUpVariant}>
          <Magnetic strength={50}>
            <div className="inline-block" onMouseEnter={handleHover} onMouseLeave={handleLeave}>
              <Link 
                to="/contact"
                className="group relative inline-flex items-center justify-center px-12 py-6 overflow-hidden rounded-full cursor-none"
              >
                <div className="absolute inset-0 w-full h-full bg-accent transition-transform duration-500 ease-out md:group-hover:scale-105" />
                <span className="relative text-bg font-mono font-medium tracking-[0.2em] uppercase text-sm z-10 md:group-hover:text-black transition-colors duration-300">
                  Start Conversation
                </span>
              </Link>
            </div>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}
