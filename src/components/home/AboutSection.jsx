import { useRef } from 'react';
import { motion } from 'framer-motion';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const wordVariants = {
  hidden: { y: '110%', rotateZ: 2, opacity: 0 },
  visible: { y: '0%', rotateZ: 0, opacity: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
};

const fadeUpVariant = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function AboutSection() {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className="py-32 px-4 md:px-12 bg-bg text-text w-full overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16 md:gap-24">
        
        {/* Left: Huge Statement */}
        <motion.div 
          className="w-full md:w-1/2 md:sticky md:top-32" 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
        >
          <div className="overflow-hidden mb-2">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none about-line">
              <motion.span variants={wordVariants} className="inline-block origin-top-left">Why</motion.span>
            </h2>
          </div>
          <div className="overflow-hidden mb-2">
            <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tighter leading-none text-accent about-line">
              <motion.span variants={wordVariants} className="inline-block origin-top-left">Havilah.</motion.span>
            </h2>
          </div>
          <div className="mt-8 overflow-hidden">
            <motion.p variants={fadeUpVariant} className="text-xl font-serif italic text-text/70 max-w-md">
              Film, content, and growth — built together.
            </motion.p>
          </div>
        </motion.div>

        {/* Right: Values */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col gap-12 mt-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
        >
          {[
            {
              title: "One team, one throughline.",
              desc: "Your film, your photos, your content, and your growth strategy are built by people who talk to each other daily — not four vendors who've never met."
            },
            {
              title: "Craft first, always.",
              desc: "Growth without a story is noise. A beautiful film with no audience is a private screening. We build both, together."
            },
            {
              title: "Built to compound.",
              desc: "Everything we make is designed to work more than once — a film becomes ad content, ad content becomes a case study, a case study becomes a growth asset."
            }
          ].map((item, idx) => (
            <motion.div variants={fadeUpVariant} key={idx} className="flex flex-col gap-2 group">
              <h3 className="text-2xl font-heading uppercase tracking-wide md:group-hover:text-accent transition-colors duration-300">{item.title}</h3>
              <p className="text-text/70 font-sans font-light leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
      </div>
    </section>
  );
}
