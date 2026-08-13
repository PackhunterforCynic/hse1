import React, { useState } from 'react';
import { useLoaderData, Form, useSubmit, useNavigation } from 'react-router';
import { db } from '../../lib/db.server';
import { requireAdminSession, logAdminAction } from '../../lib/middleware.server';
import { FileText, Trash2, CheckCircle, XCircle, X, ExternalLink, Plus, Edit2 } from 'lucide-react';

export async function loader({ request }) {
  await requireAdminSession(request);
  const applications = await db.internshipApplication.findMany({
    where: { isDeleted: false },
    orderBy: { appliedAt: 'desc' },
    include: { role: true }
  });
  const roles = await db.internshipRole.findMany({
    where: { isDeleted: false },
    orderBy: { roleId: 'desc' }
  });
  return { applications, roles };
}

export async function action({ request }) {
  const admin = await requireAdminSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  if (intent === "delete") {
    const id = parseInt(formData.get("applicationId"));
    await db.internshipApplication.update({
      where: { applicationId: id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    await logAdminAction(admin.id, 'Deleted Internship Application', 'Application', id, request);
  } else if (intent === "updateStatus") {
    const id = parseInt(formData.get("applicationId"));
    const status = formData.get("status");
    await db.internshipApplication.update({
      where: { applicationId: id },
      data: { applicationStatus: status }
    });
    await logAdminAction(admin.id, `Updated Application Status to ${status}`, 'Application', id, request);
  } else if (intent === "createRole") {
    const role = await db.internshipRole.create({
      data: {
        roleName: formData.get("roleName"),
        department: formData.get("department"),
        duration: formData.get("duration"),
        openings: parseInt(formData.get("openings")),
        description: formData.get("description"),
        status: formData.get("status")
      }
    });
    await logAdminAction(admin.id, 'Created Internship Role', 'InternshipRole', role.roleId, request);
  } else if (intent === "updateRole") {
    const id = parseInt(formData.get("roleId"));
    await db.internshipRole.update({
      where: { roleId: id },
      data: {
        roleName: formData.get("roleName"),
        department: formData.get("department"),
        duration: formData.get("duration"),
        openings: parseInt(formData.get("openings")),
        description: formData.get("description"),
        status: formData.get("status")
      }
    });
    await logAdminAction(admin.id, 'Updated Internship Role', 'InternshipRole', id, request);
  } else if (intent === "deleteRole") {
    const id = parseInt(formData.get("roleId"));
    await db.internshipRole.update({
      where: { roleId: id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    await logAdminAction(admin.id, 'Deleted Internship Role', 'InternshipRole', id, request);
  }

  return { success: true };
}

export default function Internships() {
  const { applications, roles } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'programs'
  const [viewingApp, setViewingApp] = useState(null);
  const [editingRole, setEditingRole] = useState(null); // null = not editing, {} = new, {...} = edit

  // --- Applications Handlers ---
  const handleDeleteApp = (id) => {
    if (confirm("Are you sure you want to delete this application?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("applicationId", id);
      submit(formData, { method: "post" });
      setViewingApp(null);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const formData = new FormData();
    formData.append("intent", "updateStatus");
    formData.append("applicationId", id);
    formData.append("status", newStatus);
    submit(formData, { method: "post" });
    setViewingApp(null);
  };

  // --- Roles Handlers ---
  const handleSaveRole = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("intent", editingRole.roleId ? "updateRole" : "createRole");
    if (editingRole.roleId) {
      formData.append("roleId", editingRole.roleId);
    }
    submit(formData, { method: "post" });
    setEditingRole(null);
  };

  const handleDeleteRole = (id) => {
    if (confirm("Are you sure you want to delete this program? It will be removed from the public website immediately.")) {
      const formData = new FormData();
      formData.append("intent", "deleteRole");
      formData.append("roleId", id);
      submit(formData, { method: "post" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-widest text-white">Internships</h2>
          <p className="text-white/50 font-sans text-sm mt-1">Review candidates and manage programs.</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-[#0a0a0a] border border-white/10 rounded-lg p-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex-1 md:w-32 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-colors ${activeTab === 'applications' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 md:w-32 py-1.5 text-xs font-mono uppercase tracking-widest rounded-md transition-colors ${activeTab === 'programs' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
          >
            Programs
          </button>
        </div>
      </div>

      {activeTab === 'applications' && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-[#050505]">
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Applicant</th>
                  <th className="hidden sm:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Role</th>
                  <th className="hidden md:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Date Applied</th>
                  <th className="hidden lg:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Status</th>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50 text-right md:text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-white/40 font-mono text-xs uppercase">No applications found</td>
                  </tr>
                ) : applications.map(app => (
                  <tr key={app.applicationId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-sans text-white">{app.fullName}</span>
                        <span className="text-[10px] font-mono text-white/40">{app.email}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-4">
                      <span className="text-xs font-mono text-white/80">{app.role?.roleName || 'Unknown Role'}</span>
                    </td>
                    <td className="hidden md:table-cell p-4 text-xs font-mono text-white/40">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="hidden lg:table-cell p-4">
                      <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full ${
                        app.applicationStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                        app.applicationStatus === 'accepted' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        app.applicationStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                        'bg-white/5 text-white/40'
                      }`}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end md:justify-start gap-2">
                        <button onClick={() => setViewingApp(app)} className="p-2 text-white/40 hover:text-white transition-colors"><FileText size={16} /></button>
                        <button onClick={() => handleDeleteApp(app.applicationId)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'programs' && (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#050505]">
            <h3 className="text-xs font-mono tracking-widest uppercase text-white/50">Active Programs</h3>
            <button onClick={() => setEditingRole({})} className="flex items-center gap-2 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest rounded transition-colors border border-[#D4AF37]/20">
              <Plus size={14} /> New Program
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Title / Department</th>
                  <th className="hidden sm:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Duration</th>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Openings</th>
                  <th className="hidden lg:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Status</th>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50 text-right md:text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-white/40 font-mono text-xs uppercase">No programs found</td>
                  </tr>
                ) : roles.map(role => (
                  <tr key={role.roleId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-sans text-white">{role.roleName}</span>
                        <span className="text-[10px] font-mono text-white/40">{role.department}</span>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell p-4 text-xs font-mono text-white/60">
                      {role.duration}
                    </td>
                    <td className="p-4 text-xs font-mono text-white/80">
                      {role.openings}
                    </td>
                    <td className="hidden lg:table-cell p-4">
                      <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full ${
                        role.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {role.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end md:justify-start gap-2">
                        <button onClick={() => setEditingRole(role)} className="p-2 text-white/40 hover:text-white transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDeleteRole(role.roleId)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- Review Application Modal --- */}
      {viewingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">Application Review</h3>
              <button onClick={() => setViewingApp(null)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-display text-2xl uppercase shrink-0">
                  {viewingApp.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-display text-white">{viewingApp.fullName}</h4>
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-xs font-mono text-white/50 mt-1">
                    <a href={`mailto:${viewingApp.email}`} className="hover:text-[#D4AF37]">{viewingApp.email}</a>
                    <span className="hidden md:inline">•</span>
                    <span>{viewingApp.phone}</span>
                  </div>
                </div>
                <div className="w-full md:w-auto md:ml-auto md:text-right mt-2 md:mt-0 pt-3 md:pt-0 border-t border-white/10 md:border-0">
                  <span className="block text-[10px] font-mono uppercase text-white/40 mb-2 md:mb-1">Applied For</span>
                  <span className="inline-block text-sm font-sans text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">{viewingApp.role?.roleName}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-2">Education</span>
                  <p className="text-sm text-white font-sans">{viewingApp.college}</p>
                  <p className="text-xs font-mono text-white/60 mt-1">{viewingApp.degree} • Year {viewingApp.yearOfStudy}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col justify-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-white/40 block">Links</span>
                  {viewingApp.portfolioUrl && (
                    <a href={viewingApp.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] hover:underline">
                      <ExternalLink size={12} /> Portfolio Website
                    </a>
                  )}
                  {viewingApp.linkedin && (
                    <a href={viewingApp.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-blue-400 hover:underline">
                      <ExternalLink size={12} /> LinkedIn Profile
                    </a>
                  )}
                  {viewingApp.github && (
                    <a href={viewingApp.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-white/80 hover:underline">
                      <ExternalLink size={12} /> GitHub Profile
                    </a>
                  )}
                </div>
              </div>

              {viewingApp.coverLetter && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-3">Cover Letter</span>
                  <p className="text-white/70 font-sans text-sm whitespace-pre-wrap leading-relaxed">
                    {viewingApp.coverLetter}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 bg-[#050505] flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
              <a href={viewingApp.resume} target="_blank" rel="noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono uppercase text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10">
                <FileText size={14} /> View Resume
              </a>
              
              <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-3">
                {viewingApp.applicationStatus !== 'rejected' && (
                  <button onClick={() => handleUpdateStatus(viewingApp.applicationId, 'rejected')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-mono uppercase tracking-widest rounded-lg transition-colors">
                    <XCircle size={14} /> Reject
                  </button>
                )}
                {viewingApp.applicationStatus !== 'accepted' && (
                  <button onClick={() => handleUpdateStatus(viewingApp.applicationId, 'accepted')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black text-xs font-mono uppercase tracking-widest rounded-lg transition-colors">
                    <CheckCircle size={14} /> Accept Candidate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Create/Edit Role Modal --- */}
      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">
                {editingRole.roleId ? 'Edit Program' : 'New Program'}
              </h3>
              <button onClick={() => setEditingRole(null)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSaveRole} className="flex flex-col h-full overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Title</label>
                    <input 
                      type="text" 
                      name="roleName" 
                      required 
                      defaultValue={editingRole.roleName || ''}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-sans text-sm focus:outline-none focus:border-[#D4AF37]/50"
                      placeholder="e.g. Frontend Developer"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Department</label>
                    <select 
                      name="department" 
                      required 
                      defaultValue={editingRole.department || ''}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-sans text-sm focus:outline-none focus:border-[#D4AF37]/50 [&>option]:bg-[#0a0a0a]"
                    >
                      <option value="" disabled>Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Post-Production">Post-Production</option>
                      <option value="Production">Production</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Duration</label>
                    <input 
                      type="text" 
                      name="duration" 
                      required 
                      defaultValue={editingRole.duration || ''}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-sans text-sm focus:outline-none focus:border-[#D4AF37]/50"
                      placeholder="e.g. 6 Months"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Openings</label>
                    <input 
                      type="number" 
                      name="openings" 
                      min="0"
                      required 
                      defaultValue={editingRole.openings !== undefined ? editingRole.openings : 1}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-sans text-sm focus:outline-none focus:border-[#D4AF37]/50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Status</label>
                    <select 
                      name="status" 
                      required 
                      defaultValue={editingRole.status || 'open'}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white font-sans text-sm focus:outline-none focus:border-[#D4AF37]/50 [&>option]:bg-[#0a0a0a]"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono uppercase text-white/50 tracking-widest">Description</label>
                  <textarea 
                    name="description" 
                    required 
                    rows="4"
                    defaultValue={editingRole.description || ''}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm focus:outline-none focus:border-[#D4AF37]/50 resize-none"
                    placeholder="Enter the role responsibilities and requirements..."
                  ></textarea>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-[#050505] flex justify-end shrink-0 gap-3">
                <button type="button" onClick={() => setEditingRole(null)} className="px-5 py-2 text-white/50 hover:text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={navigation.state !== 'idle'} className="px-6 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black text-xs font-mono uppercase tracking-widest rounded-lg transition-colors disabled:opacity-50">
                  {navigation.state === 'submitting' ? 'Saving...' : 'Save Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
