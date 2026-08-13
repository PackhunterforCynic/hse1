export default function StepReview({ formData, files }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-2xl font-display uppercase tracking-wider mb-2">Review Application</h3>
        <p className="text-white/50 font-sans font-light text-sm">Please verify your details before submitting.</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col gap-4">
        
        <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Name</p>
            <p className="font-sans text-sm">{formData.name}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Role</p>
            <p className="font-sans text-sm text-accent">{formData.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Email</p>
            <p className="font-sans text-sm truncate">{formData.email}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Phone</p>
            <p className="font-sans text-sm">{formData.phone}</p>
          </div>
        </div>

        <div className="border-b border-white/10 pb-4">
          <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Education</p>
          <p className="font-sans text-sm">{formData.fieldOfStudy} at {formData.institution}</p>
        </div>

        <div className="border-b border-white/10 pb-4">
          <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-1">Skills</p>
          <p className="font-sans text-sm truncate">{formData.skills}</p>
        </div>

        <div>
          <p className="text-[10px] font-mono tracking-widest uppercase text-white/40 mb-2">Attached Files & Links</p>
          <div className="flex flex-col gap-2">
            {files.resume && (
              <div className="flex items-center gap-2 text-sm font-sans">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Resume: {files.resume.name}
              </div>
            )}
            {files.portfolio && (
              <div className="flex items-center gap-2 text-sm font-sans">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Portfolio PDF: {files.portfolio.name}
              </div>
            )}
            {formData.portfolioLink && (
              <div className="flex items-center gap-2 text-sm font-sans truncate">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                Link: {formData.portfolioLink}
              </div>
            )}
            {!files.resume && !files.portfolio && !formData.portfolioLink && (
              <span className="text-sm font-sans text-white/50">No files or links provided.</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
