import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function NavbarLogo() {
  const text = "Havilah";
  const letters = text.split("");

  // Generate stable random dust particles for each letter
  const dustPerLetter = useMemo(() => {
    return letters.map(() => {
      // 3-4 golden sand particles per letter
      return Array.from({ length: 4 }).map((_, i) => ({
        id: i,
        // Pixel drift left/right as they fall
        xDrift: (Math.random() - 0.5) * 60, 
        // 1px to 3px size
        size: Math.random() * 2 + 1.5, 
        // Percentage of the loop they spend falling (approx 3-4 seconds out of 6s)
        fallTime: 0.5 + Math.random() * 0.3 
      }));
    });
  }, [letters]);

  return (
    <div className="flex items-center relative">
      {letters.map((char, index) => {
        const particles = dustPerLetter[index];
        return (
          <div key={index} className="relative flex flex-col items-center">
            {/* The Letter */}
            <motion.span
              animate={{
                y: [0, -12, 0, 0], // Rise, strike ground, rest
                opacity: [0.6, 1, 1, 0.6],
              }}
              transition={{
                duration: 6, // 6s cycle to give plenty of time for slow falling dust
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.15,
                times: [0, 0.1, 0.2, 1] // Impact occurs at exactly 20% of the cycle (1.2s)
              }}
              className="relative z-20 block"
            >
              {char}
            </motion.span>
            
            {/* The Gold Sand Dust */}
            {particles.map((p) => (
              <motion.span
                key={p.id}
                animate={{
                  y: ["0vh", "0vh", "0vh", "110vh"], // Wait, wait, impact, fall to bottom of screen
                  x: [0, 0, 0, p.xDrift], // Drift horizontally as it falls
                  opacity: [0, 0, 0.9, 0], // Burst to 0.9 opacity on impact, fade out while falling
                }}
                transition={{
                  duration: 6, // Syncs exactly with letter loop
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.15,
                  // 1: Time=0 (Start)
                  // 2: Time=0.19 (Just before impact)
                  // 3: Time=0.2 (Impact! Dust bursts)
                  // 4: Time=0.2 + fallTime (Dust reaches bottom)
                  times: [0, 0.19, 0.2, Math.min(0.2 + p.fallTime, 0.99)]
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none z-10 bg-[#EFE6D2]"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  boxShadow: "0 0 10px rgba(239,230,210,1)"
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
