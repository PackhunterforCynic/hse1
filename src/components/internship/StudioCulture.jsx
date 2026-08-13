import { motion } from 'framer-motion';
import havilahLogo from '../../assets/image.png';

export default function StudioCulture() {
  return (
    <div className="w-full py-32 bg-primary px-6 md:px-12 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
            {/* Placeholder for behind-the-scenes image */}
            <img 
              src={havilahLogo} 
              alt="Studio Culture" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
            <div className="absolute bottom-8 left-8">
              <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-mono tracking-widest uppercase text-white border border-white/20">
                Behind The Scenes
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex flex-col justify-center"
        >
          <h2 className="text-5xl md:text-7xl font-display uppercase tracking-tight mb-8">
            Built on <br/> <span className="text-accent">Collaboration</span>
          </h2>
          <p className="text-lg text-white/70 mb-6 font-sans font-light leading-relaxed">
            At Havilah, we believe the best ideas come from a collision of different perspectives. Our studio isn't just a workplace; it's a creative playground where discipline meets imagination.
          </p>
          <p className="text-lg text-white/70 mb-10 font-sans font-light leading-relaxed">
            Whether you are on a chaotic film set, iterating over a design system, or grading footage in the dark room, you will be surrounded by people who care deeply about the craft.
          </p>
          
          <div className="flex gap-12 border-t border-white/10 pt-8 mt-4">
            <div>
              <p className="text-4xl font-display text-accent mb-2">12+</p>
              <p className="text-xs font-mono tracking-widest uppercase text-white/50">Active Projects</p>
            </div>
            <div>
              <p className="text-4xl font-display text-accent mb-2">3</p>
              <p className="text-xs font-mono tracking-widest uppercase text-white/50">Studio Spaces</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
