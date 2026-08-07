export default function StepSkills({ formData, updateFormData, errors }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-display uppercase tracking-wider mb-2">Role & Skills</h3>
        <p className="text-white/50 font-sans font-light text-sm">What are you applying for and what tools do you use?</p>
      </div>

      <div className="flex flex-col gap-2 relative">
        <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Role *</label>
        <select 
          value={formData.role}
          onChange={(e) => updateFormData({ role: e.target.value })}
          className="w-full bg-white/5 border border-white/10 hover:border-white/30 focus:border-accent/50 rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base text-white appearance-none cursor-pointer"
        >
          <option value="" disabled className="bg-primary text-white/50">Select a role...</option>
          <option value="Frontend Developer" className="bg-primary text-white">Frontend Developer</option>
          <option value="Video Editor" className="bg-primary text-white">Video Editor</option>
          <option value="Graphic Designer" className="bg-primary text-white">Graphic Designer</option>
          <option value="Photography Intern" className="bg-primary text-white">Photography Intern</option>
        </select>
        <div className="absolute right-4 top-[42px] pointer-events-none text-white/50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
        <p className="text-[10px] font-mono text-white/40 ml-1 mt-1">You can change your selected role here.</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Key Skills / Software *</label>
        <textarea 
          rows="4"
          value={formData.skills}
          onChange={(e) => updateFormData({ skills: e.target.value })}
          className={`w-full bg-white/5 border ${errors?.skills ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base text-white resize-none`}
          placeholder="e.g. React, Framer Motion, Premiere Pro, Figma, Cinema4D..."
        ></textarea>
        {errors?.skills && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.skills}</span>}
      </div>
    </div>
  );
}
