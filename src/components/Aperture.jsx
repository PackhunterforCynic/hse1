import { motion } from 'framer-motion';

export default function Aperture({ phase }) {
  const isOpen = phase === 'opening' || phase === 'reading' || phase === 'flying' || phase === 'done';

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden z-20 pointer-events-none">
      <motion.svg 
        className="w-[250vw] h-[250vh] min-w-[1500px] min-h-[1500px]" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="xMidYMid slice"
        style={{ willChange: 'transform' }}
        initial={{ rotate: 0 }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 1.8, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* 8 blades forming an octagonal iris */}
        {[...Array(8)].map((_, i) => (
          <g key={i} transform={`rotate(${i * 45}, 50, 50)`} style={{ willChange: 'transform' }}>
            <motion.polygon 
              points="-100,50 200,50 200,200 -100,200"
              fill="#050505"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="0.4"
              style={{ willChange: 'transform' }}
              initial={{ y: 0 }}
              animate={{ y: isOpen ? 60 : 0 }}
              transition={{ 
                duration: 1.8, 
                ease: [0.76, 0, 0.24, 1],
                delay: i * 0.01 // Tiny stagger for mechanical imperfection
              }}
            />
          </g>
        ))}
      </motion.svg>
    </div>
  );
}
