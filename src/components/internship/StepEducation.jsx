export default function StepEducation({ formData, updateFormData, errors }) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h3 className="text-xl md:text-2xl font-display uppercase tracking-wider mb-1 md:mb-2">Education</h3>
        <p className="text-white/50 font-sans font-light text-xs md:text-sm">Tell us where you learned your craft. (Formal degree not required)</p>
      </div>

      <div className="flex flex-col gap-1 md:gap-2">
        <label className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Institution / School *</label>
        <input 
          type="text" 
          value={formData.institution}
          onChange={(e) => updateFormData({ institution: e.target.value })}
          className={`w-full bg-white/5 border ${errors?.institution ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-2.5 md:py-3 outline-none transition-all duration-300 font-sans text-sm md:text-base text-white`}
          placeholder="University Name, Bootcamp, or 'Self-Taught'"
        />
        {errors?.institution && <span className="text-[10px] font-mono text-red-400 ml-1">{errors.institution}</span>}
      </div>

      <div className="flex flex-col gap-1 md:gap-2">
        <label className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Field of Study / Focus *</label>
        <input 
          type="text" 
          value={formData.fieldOfStudy}
          onChange={(e) => updateFormData({ fieldOfStudy: e.target.value })}
          className={`w-full bg-white/5 border ${errors?.fieldOfStudy ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-2.5 md:py-3 outline-none transition-all duration-300 font-sans text-sm md:text-base text-white`}
          placeholder="e.g. Film Production, Computer Science, Graphic Design"
        />
        {errors?.fieldOfStudy && <span className="text-[10px] font-mono text-red-400 ml-1">{errors.fieldOfStudy}</span>}
      </div>
    </div>
  );
}
