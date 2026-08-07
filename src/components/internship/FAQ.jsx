import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

const faqs = [
  {
    question: "Is this a paid internship?",
    answer: "Yes, all our internships are paid. We believe in compensating creatives for their time and talent, regardless of their experience level."
  },
  {
    question: "How long does the program last?",
    answer: "Our standard internship program runs for 12 weeks, with options to extend or transition into a full-time role based on performance and studio needs."
  },
  {
    question: "Do I need a formal degree to apply?",
    answer: "No. We care about your portfolio, your drive, and your taste. A degree is completely optional."
  },
  {
    question: "Is this remote or on-site?",
    answer: "This is a hybrid role, but we strongly prefer candidates who can spend at least 3 days a week at our Bangalore studio for hands-on collaboration."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const { updateCursor, resetCursor } = useCursor();

  return (
    <div className="w-full py-32 bg-primary px-6 md:px-12 relative z-10 border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-display uppercase tracking-tight mb-4">Questions?</h2>
          <p className="text-white/50 font-mono uppercase tracking-widest text-sm">We've got answers</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-white/10 pb-4"
            >
              <button
                className="w-full py-6 flex justify-between items-center text-left cursor-none group"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                onMouseEnter={() => updateCursor({ active: true })}
                onMouseLeave={resetCursor}
              >
                <span className={`text-xl md:text-2xl font-display uppercase tracking-wider transition-colors duration-300 ${openIndex === index ? 'text-accent' : 'text-white group-hover:text-white/80'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-500 ${openIndex === index ? 'rotate-45 border-accent text-accent bg-accent/10' : 'group-hover:border-white/50'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-white/60 font-sans font-light leading-relaxed max-w-2xl">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
