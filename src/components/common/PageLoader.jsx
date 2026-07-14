import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="min-h-screen w-full bg-bg flex flex-col items-center justify-center fixed inset-0 z-[9998]">
      <div className="relative flex flex-col items-center gap-4">
        <motion.span 
          className="text-[10px] font-mono tracking-[0.3em] uppercase text-accent"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading
        </motion.span>
        <div className="w-24 h-[1px] bg-white/20 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 w-full h-full bg-accent origin-left"
            animate={{ 
              scaleX: [0, 1, 1, 0],
              transformOrigin: ['left', 'left', 'right', 'right']
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: [0.76, 0, 0.24, 1]
            }}
          />
        </div>
      </div>
    </div>
  );
}
