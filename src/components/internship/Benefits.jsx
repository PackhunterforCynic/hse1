import React from 'react';
import { motion } from 'framer-motion';

const benefits = [
  {
    title: 'Industry Experience',
    description: 'Work on actual studio productions and campaigns, not simulated exercises.'
  },
  {
    title: 'Real Client Projects',
    description: 'Build your portfolio with deliverables that go live for premium brands.'
  },
  {
    title: 'Creative Freedom',
    description: 'Experiment with your own ideas in a studio that values bold storytelling.'
  },
  {
    title: 'Professional Mentorship',
    description: 'Get direct feedback and guidance from senior directors and engineers.'
  },
  {
    title: 'Portfolio Development',
    description: 'Leave with a curated, professional body of work that stands out.'
  },
  {
    title: 'Career Opportunities',
    description: 'Top performers are directly offered full-time roles at Havilah Studio.'
  }
];

export default function Benefits() {
  return (
    <section className="w-full py-32 bg-[#070707] px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none mix-blend-overlay" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tighter mb-4 text-[#F8F6F2]">
            Why Join Havilah
          </h2>
          <p className="text-xl font-serif italic text-white/50 max-w-2xl mx-auto">
            An apprenticeship designed to accelerate your creative career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-[#111111] border border-white/5 p-8 rounded-3xl hover:bg-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <h3 className="text-2xl font-display uppercase tracking-tight text-[#F8F6F2] mb-4">
                {benefit.title}
              </h3>
              <p className="text-white/60 font-sans font-light leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
