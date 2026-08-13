import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "Application & Portfolio",
    description: "Submit your details along with your best work. We look for raw talent, unique perspectives, and a genuine passion for cinematic storytelling."
  },
  {
    num: "02",
    title: "Creative Evaluation",
    description: "Our senior directors and engineers review your portfolio. We evaluate your technical foundation and your potential for creative growth."
  },
  {
    num: "03",
    title: "Director Interview",
    description: "A 1-on-1 conversation to understand your goals, your creative process, and how you handle real-world studio pressure."
  },
  {
    num: "04",
    title: "Studio Onboarding",
    description: "Welcome to Havilah. You'll be assigned your first real client project and paired with a senior mentor from day one."
  }
];

export default function Roadmap() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="w-full py-32 bg-[#070707] px-6 md:px-12 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-display uppercase tracking-tighter text-white mb-4"
          >
            The Path to <span className="text-[#D4AF37] font-serif italic font-normal">Havilah</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/50 font-sans font-light max-w-xl mx-auto"
          >
            Our selection process is rigorous because we treat our apprentices as full studio members from day one.
          </motion.p>
        </div>

        <div className="relative pl-8 md:pl-0">
          {/* Animated Vertical Line */}
          <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2">
            <motion.div 
              style={{ height: lineHeight }} 
              className="w-full bg-[#D4AF37] shadow-[0_0_15px_#D4AF37]"
            />
          </div>

          <div className="flex flex-col gap-16 md:gap-24">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={step.num} className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Glowing Node */}
                  <div className="absolute left-[-23px] md:left-1/2 md:-translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full bg-[#070707] border border-[#D4AF37] flex items-center justify-center z-10 mt-1 md:mt-0">
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="w-2 h-2 bg-[#D4AF37] rounded-full"
                    />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16'} pl-6 md:pl-0`}>
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl hover:border-[#D4AF37]/30 transition-colors duration-500 group"
                    >
                      <span className="text-5xl font-display text-white/5 group-hover:text-[#D4AF37]/10 transition-colors absolute top-4 right-8 select-none pointer-events-none">
                        {step.num}
                      </span>
                      <h3 className="text-xl font-display uppercase tracking-wider text-white mb-3 relative z-10">
                        {step.title}
                      </h3>
                      <p className="text-white/60 font-sans font-light text-sm leading-relaxed relative z-10">
                        {step.description}
                      </p>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
