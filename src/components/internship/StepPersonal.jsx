export default function StepPersonal({ formData, updateFormData, errors }) {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h3 className="text-xl md:text-2xl font-display uppercase tracking-wider mb-1 md:mb-2">Personal Details</h3>
        <p className="text-white/50 font-sans font-light text-xs md:text-sm">Let's start with the basics.</p>
      </div>

      <div className="flex flex-col gap-1 md:gap-2">
        <label className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Full Name *</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => updateFormData({ name: e.target.value })}
          className={`w-full bg-white/5 border ${errors?.name ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-2.5 md:py-3 outline-none transition-all duration-300 font-sans text-sm md:text-base text-white`}
          placeholder="Jane Doe"
        />
        {errors?.name && <span className="text-[10px] font-mono text-red-400 ml-1">{errors.name}</span>}
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex flex-col gap-1 md:gap-2 w-full">
          <label className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Email *</label>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            className={`w-full bg-white/5 border ${errors?.email ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-2.5 md:py-3 outline-none transition-all duration-300 font-sans text-sm md:text-base text-white`}
            placeholder="jane@example.com"
          />
          {errors?.email && <span className="text-[10px] font-mono text-red-400 ml-1">{errors.email}</span>}
        </div>
        <div className="flex flex-col gap-1 md:gap-2 w-full">
          <label className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Phone *</label>
          <input 
            type="tel" 
            value={formData.phone}
            onInput={(e) => { e.target.value = e.target.value.replace(/[^0-9+\-().\s]/g, ''); }}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            className={`w-full bg-white/5 border ${errors?.phone ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-2.5 md:py-3 outline-none transition-all duration-300 font-sans text-sm md:text-base text-white`}
            placeholder="+1 234 567 890"
          />
          {errors?.phone && <span className="text-[10px] font-mono text-red-400 ml-1">{errors.phone}</span>}
        </div>
      </div>
    </div>
  );
}
