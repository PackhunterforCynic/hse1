import { useRef } from 'react';

export default function StepPortfolio({ formData, updateFormData, files, updateFiles, errors }) {
  const resumeRef = useRef(null);
  const portfolioRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      updateFiles({ [type]: file });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-display uppercase tracking-wider mb-2">Show Your Work</h3>
        <p className="text-white/50 font-sans font-light text-sm">Upload your resume and portfolio (PDFs preferred, max 5MB).</p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Resume / CV (PDF) *</label>
        <input 
          type="file" 
          ref={resumeRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'resume')}
        />
        <button 
          type="button"
          onClick={() => resumeRef.current?.click()}
          className={`w-full bg-white/5 border ${errors?.resume ? 'border-red-500/50' : 'border-white/10 hover:border-white/30'} rounded-xl px-4 py-4 outline-none transition-all duration-300 font-sans text-sm text-white/70 flex items-center justify-center gap-2 border-dashed`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          {files.resume ? files.resume.name : 'Upload Resume'}
        </button>
        {errors?.resume && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.resume}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Portfolio (PDF)</label>
        <input 
          type="file" 
          ref={portfolioRef}
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'portfolio')}
        />
        <button 
          type="button"
          onClick={() => portfolioRef.current?.click()}
          className="w-full bg-white/5 border border-white/10 hover:border-white/30 rounded-xl px-4 py-4 outline-none transition-all duration-300 font-sans text-sm text-white/70 flex items-center justify-center gap-2 border-dashed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          {files.portfolio ? files.portfolio.name : 'Upload Portfolio (PDF)'}
        </button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink-0 mx-4 text-white/40 text-xs font-mono uppercase">OR</span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono tracking-widest uppercase text-white/70 ml-1">Portfolio Website Link</label>
        <input 
          type="url" 
          value={formData.portfolioLink}
          onChange={(e) => updateFormData({ portfolioLink: e.target.value })}
          className={`w-full bg-white/5 border ${errors?.portfolioLink ? 'border-red-500/50' : 'border-white/10 focus:border-accent/50'} rounded-xl px-4 py-3 outline-none transition-all duration-300 font-sans text-base text-white`}
          placeholder="https://yourportfolio.com"
        />
        {errors?.portfolioLink && <span className="text-[10px] font-mono text-red-400 ml-1 mt-1">{errors.portfolioLink}</span>}
      </div>
    </div>
  );
}
