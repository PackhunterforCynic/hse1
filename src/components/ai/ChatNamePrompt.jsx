import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { useAI } from '../../context/AIProvider';
import { useLanguage } from '../../i18n';

export default function ChatNamePrompt() {
  const { saveUserName } = useAI();
  const { t } = useLanguage();
  const [inputName, setInputName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputName.trim()) {
      saveUserName(inputName.trim());
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#0a0a0a]">
      {/* Ambient Cinematic Lens Warmth */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#EFE6D2]/5 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none" />

      {/* Decorative Top Sparkle */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(239,230,210,0.15)] relative z-10"
      >
        <Sparkles className="text-[#EFE6D2] w-6 h-6 animate-pulse" />
      </motion.div>

      {/* Studio Greeting & Preamble */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xs mb-8"
      >
        <h4 className="font-display tracking-[0.25em] uppercase text-xs text-[#EFE6D2] mb-3 font-semibold">
          Havilah Creative Concierge
        </h4>
        <p className="font-serif italic text-base md:text-lg text-white/90 font-light leading-relaxed">
          &ldquo;Stories that move. Brands that endure.&rdquo;
        </p>
        <p className="text-xs text-white/60 mt-4 leading-normal font-sans">
          Before we explore your creative ambition, whom do we have the honor of addressing?
        </p>
      </motion.div>

      {/* Name Form */}
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xs relative z-10 flex flex-col gap-3"
      >
        <div className={`relative flex items-center border rounded-xl transition-all duration-300 bg-black/40 backdrop-blur-md overflow-hidden ${
          isFocused ? 'border-[#EFE6D2] shadow-[0_0_20px_rgba(239,230,210,0.15)]' : 'border-white/15 hover:border-white/30'
        }`}>
          <User className="w-4 h-4 text-white/40 ml-4 shrink-0" />
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Your distinguished name..."
            className="w-full bg-transparent px-3 py-3.5 text-sm text-white placeholder-white/40 focus:outline-none font-sans"
            maxLength={40}
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!inputName.trim()}
          className="w-full py-3.5 px-5 bg-[#EFE6D2] hover:bg-white text-black font-sans text-xs font-semibold tracking-[0.2em] uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:pointer-events-none group shadow-[0_0_25px_rgba(239,230,210,0.2)]"
        >
          <span>Enter Studio</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </motion.form>

      {/* Footer minimal tag */}
      <div className="absolute bottom-4 text-[9px] font-mono tracking-widest uppercase text-white/30 z-10">
        Personalized Consultation Environment
      </div>
    </div>
  );
}
