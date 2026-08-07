import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

export default function ProgramCard({ program, onApply }) {
  const { updateCursor, resetCursor } = useCursor();

  return (
    <motion.div 
      className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 overflow-hidden flex flex-col justify-between min-h-[300px] transition-colors hover:bg-white/5"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-opacity group-hover:opacity-20 text-accent">
        {program.icon}
      </div>
      
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-mono tracking-widest uppercase text-white/50 border border-white/10">
            {program.department}
          </span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase ${program.isOpen ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/50 border border-white/10'}`}>
            {program.isOpen ? 'Open' : 'Coming Soon'}
          </span>
        </div>
        <h3 className="text-3xl font-display uppercase tracking-tight mb-4 pr-12">{program.title}</h3>
        <p className="text-sm text-white/70 leading-relaxed mb-6 font-sans font-light">
          {program.description}
        </p>
      </div>

      <button
        onClick={() => program.isOpen && onApply(program.title)}
        disabled={!program.isOpen}
        className={`w-full py-4 rounded-xl font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${program.isOpen ? 'bg-white/5 border border-white/10 text-white/90 hover:bg-accent hover:border-transparent hover:text-bg cursor-none' : 'bg-transparent border border-white/5 text-white/30 cursor-not-allowed'}`}
        onMouseEnter={() => program.isOpen && updateCursor({ active: true })}
        onMouseLeave={resetCursor}
      >
        {program.isOpen ? 'Apply for this role' : 'Closed'}
        {program.isOpen && (
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        )}
      </button>
    </motion.div>
  );
}
