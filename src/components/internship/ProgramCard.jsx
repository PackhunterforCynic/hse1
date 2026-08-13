import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';

export default function ProgramCard({ program, onApply }) {
  const { updateCursor, resetCursor } = useCursor();

  return (
    <motion.div 
      className="group relative bg-[#080808] border border-white/10 rounded-2xl p-8 overflow-hidden flex flex-col justify-between min-h-[360px] transition-all duration-500 hover:bg-[#0c0c0c] hover:border-[#D4AF37]/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)]"
      whileHover={{ y: -4 }}
    >
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none transition-all duration-700 group-hover:opacity-10 group-hover:scale-110 text-[#D4AF37]">
        {program.icon}
      </div>
      
      <div>
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-white/5 rounded-sm text-[9px] font-mono tracking-[0.2em] uppercase text-white/50 border border-white/5">
            {program.department}
          </span>
          <span className={`px-3 py-1 rounded-sm text-[9px] font-mono tracking-[0.2em] uppercase ${program.isOpen ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : 'bg-white/5 text-white/30 border border-white/5'}`}>
            {program.isOpen ? 'Accepting Applications' : 'Waitlist Only'}
          </span>
        </div>
        
        <h3 className="text-2xl font-display uppercase tracking-wider mb-3 pr-8 text-white group-hover:text-[#D4AF37] transition-colors duration-300">
          {program.title}
        </h3>
        <p className="text-sm text-white/50 leading-relaxed mb-6 font-sans font-light">
          {program.description}
        </p>

        {/* Availability Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5">
          <div>
            <p className="text-[9px] font-mono tracking-widest uppercase text-white/30 mb-1">Start Date</p>
            <p className="text-xs font-sans text-white/80">{program.metadata?.startDate || 'Rolling'}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono tracking-widest uppercase text-white/30 mb-1">Duration</p>
            <p className="text-xs font-sans text-white/80">{program.metadata?.duration || '3-6 Months'}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono tracking-widest uppercase text-white/30 mb-1">Location</p>
            <p className="text-xs font-sans text-white/80">{program.metadata?.location || 'Hybrid / Remote'}</p>
          </div>
          <div>
            <p className="text-[9px] font-mono tracking-widest uppercase text-white/30 mb-1">Slots</p>
            <p className="text-xs font-sans text-white/80">{program.metadata?.slots || 'Limited'}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => program.isOpen && onApply(program.title)}
        disabled={!program.isOpen}
        className={`w-full py-4 rounded-sm font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-3 transition-all duration-300 ${program.isOpen ? 'bg-white/5 border border-white/10 text-white hover:bg-[#D4AF37] hover:border-transparent hover:text-black cursor-none group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]' : 'bg-transparent border border-white/5 text-white/20 cursor-not-allowed'}`}
        onMouseEnter={() => program.isOpen && updateCursor({ active: true })}
        onMouseLeave={resetCursor}
      >
        {program.isOpen ? 'Submit Dossier' : 'Currently Closed'}
        {program.isOpen && (
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        )}
      </button>
    </motion.div>
  );
}
