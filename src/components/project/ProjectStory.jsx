import React from 'react';
import { motion } from 'framer-motion';

export default function ProjectStory({ story, narrative }) {
  // Mock narrative if none provided for cinematic storytelling
  const narrativeSections = narrative || [
    { title: "The Challenge", content: story || "We needed to build a narrative that captures the essence of the project while maintaining an authentic look and feel." },
    { title: "Our Approach", content: "Through extensive research and intimate storytelling, we crafted a visual journey that highlights the core emotions of the subjects." },
    { title: "The Result", content: "A highly acclaimed piece that resonated with audiences, driving engagement and leaving a lasting brand impact." }
  ];

  return (
    <section className="py-24 px-4 md:px-12 max-w-[1920px] mx-auto w-full border-t border-white/5 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        <div className="lg:col-span-4">
          <h2 className="text-sm font-mono tracking-widest text-accent uppercase mb-4 sticky top-32">The Story</h2>
        </div>
        <div className="lg:col-span-8 flex flex-col gap-24">
          {narrativeSections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h3 className="text-3xl md:text-5xl font-display uppercase tracking-widest text-text mb-8">
                {section.title}
              </h3>
              <p className="text-xl md:text-2xl font-light font-serif italic text-text/70 leading-relaxed max-w-3xl">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
