import { motion } from 'framer-motion';

export default function SuccessAnimation({ onClose }) {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full py-12">
      <div className="relative mb-8 mt-4 w-full max-w-lg mx-auto flex items-center justify-center h-[280px]">
        {/* Intense Light Ray from top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[150%] bg-accent/20 blur-[50px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[100%] bg-white/30 blur-[20px] mix-blend-screen pointer-events-none" />
        
        {/* Concentric Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none"
        >
          <svg viewBox="0 0 200 200" className="w-64 h-64 text-accent">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.2" />
          </svg>
        </motion.div>

        {/* Floating Accents */}
        {/* Clapperboard */}
        <motion.div
          initial={{ opacity: 0, x: -30, y: -20, rotate: -20 }}
          animate={{ opacity: 0.8, x: 0, y: 0, rotate: [-15, -10, -15] }}
          transition={{ opacity: { delay: 0.5 }, rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute top-4 left-2 lg:left-8 w-14 h-14 text-accent drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
            <path d="M2 10h20"></path>
            <path d="M6 3l4 7"></path>
            <path d="M14 3l4 7"></path>
          </svg>
        </motion.div>

        {/* Film Reel Strip */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: -30, rotate: 20 }}
          animate={{ opacity: 0.8, x: 0, y: 0, rotate: [20, 25, 20] }}
          transition={{ opacity: { delay: 0.6 }, rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute top-0 right-2 lg:right-10 w-20 h-20 text-accent drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 90 Q 40 10 90 40" strokeWidth="10" />
            <path d="M10 90 Q 40 10 90 40" strokeWidth="10" strokeDasharray="2 4" stroke="black" />
          </svg>
        </motion.div>

        {/* Vintage Camera */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 30 }}
          animate={{ opacity: 0.8, x: 0, y: 0, y: [0, -5, 0] }}
          transition={{ opacity: { delay: 0.7 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute bottom-4 right-2 lg:right-10 w-14 h-14 text-accent drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            <circle cx="8" cy="12" r="3" />
          </svg>
        </motion.div>

        {/* Cinematic Sparkles & Diamonds */}
        {[...Array(12)].map((_, i) => {
          const isDiamond = i % 3 === 0;
          return (
            <motion.svg
              key={i}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1.2, 0], 
                opacity: [0, 1, 0],
                rotate: isDiamond ? [0, 90] : [0, 180],
                y: [0, -40]
              }}
              transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: `${10 + Math.random() * 80}%`,
                left: `${5 + Math.random() * 90}%`,
              }}
              className="w-4 h-4 text-accent pointer-events-none drop-shadow-[0_0_6px_rgba(255,215,0,0.9)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              {isDiamond ? (
                <rect x="10" y="10" width="4" height="4" transform="rotate(45 12 12)" />
              ) : (
                <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
              )}
            </motion.svg>
          );
        })}

        {/* Central Glowing Checkmark with Aperture */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="relative z-10 w-40 h-40 rounded-full flex items-center justify-center"
        >
          {/* Thick Glowing Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-accent/80 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)] shadow-[inset_0_0_20px_rgba(255,215,0,0.5)] bg-primary/80 backdrop-blur-md" />
          
          {/* Lens Flare on Ring */}
          <div className="absolute top-[-2px] left-1/2 -translate-x-1/2 w-20 h-1 bg-white rounded-full blur-[2px] opacity-80 mix-blend-screen" />
          <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 w-10 h-6 bg-white blur-[10px] opacity-50 mix-blend-screen rounded-full" />

          {/* Aperture Mechanism */}
          <motion.div
            initial={{ rotate: -90, scale: 1.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: "backOut", delay: 0.2 }}
            className="absolute inset-2 text-accent/30 pointer-events-none"
          >
            <svg viewBox="0 0 100 100" fill="currentColor">
              {/* Aperture blades */}
              <polygon points="50,15 90,30 65,45" opacity="0.8" />
              <polygon points="85,50 70,90 55,65" opacity="0.8" />
              <polygon points="50,85 10,70 35,55" opacity="0.8" />
              <polygon points="15,50 30,10 45,35" opacity="0.8" />
              {/* Inner cutout for checkmark */}
              <circle cx="50" cy="50" r="25" fill="#0A0A0A" />
            </svg>
          </motion.div>

          {/* Checkmark */}
          <motion.svg 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
            className="w-16 h-16 text-accent drop-shadow-[0_0_12px_rgba(255,215,0,1)] relative z-10" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
          </motion.svg>
        </motion.div>
      </div>
      
      <motion.h3 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-4xl md:text-5xl font-display uppercase tracking-tight mb-4 text-accent drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]"
      >
        Application Submitted!
      </motion.h3>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-white/70 font-sans font-light max-w-md mb-10"
      >
        Thank you for applying to Havilah. Our recruitment team will review your application and portfolio. Keep an eye on your inbox.
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onClose}
        className="px-8 py-3 border border-white/20 rounded-full font-mono text-xs tracking-widest uppercase hover:bg-white/5 transition-colors cursor-none"
      >
        Close Window
      </motion.button>
    </div>
  );
}
