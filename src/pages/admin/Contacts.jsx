import React, { useState } from 'react';
import { useLoaderData, Form, useSubmit, useNavigation } from 'react-router';
import { db } from '../../lib/db.server';
import { requireAdminSession, logAdminAction } from '../../lib/middleware.server';
import { Eye, Trash2, CheckCircle, X } from 'lucide-react';

export async function loader({ request }) {
  await requireAdminSession(request);
  const contacts = await db.contact.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' }
  });
  return { contacts };
}

export async function action({ request }) {
  const admin = await requireAdminSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = parseInt(formData.get("contactId"));
  
  if (intent === "delete") {
    await db.contact.update({
      where: { contactId: id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    await logAdminAction(admin.id, 'Deleted Contact Message', 'Contact', id, request);
  } else if (intent === "updateStatus") {
    const status = formData.get("status");
    await db.contact.update({
      where: { contactId: id },
      data: { status }
    });
    await logAdminAction(admin.id, `Updated Contact Status to ${status}`, 'Contact', id, request);
  }

  return { success: true };
}

export default function Contacts() {
  const { contacts } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  
  const [viewingContact, setViewingContact] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this message?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("contactId", id);
      submit(formData, { method: "post" });
      setViewingContact(null);
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    const formData = new FormData();
    formData.append("intent", "updateStatus");
    formData.append("contactId", id);
    formData.append("status", newStatus);
    submit(formData, { method: "post" });
    setViewingContact(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-display uppercase tracking-widest text-white">Contacts</h2>
        <p className="text-white/50 font-sans text-sm mt-1">Manage general enquiries and messages.</p>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#050505]">
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Sender</th>
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Subject</th>
                <th className="hidden sm:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Date</th>
                <th className="hidden md:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Status</th>
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50 text-right md:text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-white/40 font-mono text-xs uppercase">No messages found</td>
                </tr>
              ) : contacts.map(contact => (
                <tr key={contact.contactId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-sans text-white">{contact.name}</span>
                      <span className="text-[10px] font-mono text-white/40">{contact.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-sans text-white/80">{contact.subject}</span>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{contact.enquiryType}</span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell p-4 text-xs font-mono text-white/40">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="hidden md:table-cell p-4">
                    <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full ${
                      contact.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 
                      contact.status === 'replied' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      'bg-white/5 text-white/40'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end md:justify-start gap-2">
                      <button onClick={() => setViewingContact(contact)} className="p-2 text-white/40 hover:text-white transition-colors"><Eye size={16} /></button>
                      <button onClick={() => handleDelete(contact.contactId)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewingContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">Message Details</h3>
              <button onClick={() => setViewingContact(null)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">From</span>
                  <p className="text-sm text-white font-sans">{viewingContact.name}</p>
                  <a href={`mailto:${viewingContact.email}`} className="text-xs font-mono text-[#D4AF37] hover:underline">{viewingContact.email}</a>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <span className="text-[10px] font-mono uppercase text-white/40 block mb-1">Details</span>
                  <p className="text-sm text-white font-sans">{viewingContact.phone || 'No phone provided'}</p>
                  <p className="text-xs font-mono text-white/60 mt-1">{new Date(viewingContact.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
                  <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    {viewingContact.enquiryType}
                  </span>
                  <h4 className="text-lg font-display text-white">{viewingContact.subject}</h4>
                </div>
                <p className="text-white/70 font-sans text-sm whitespace-pre-wrap leading-relaxed">
                  {viewingContact.message}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#050505] flex flex-col sm:flex-row justify-between items-center shrink-0 gap-4">
              <button onClick={() => handleDelete(viewingContact.contactId)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-xs font-mono uppercase text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={14} /> Delete
              </button>
              
              <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row">
                {viewingContact.status !== 'replied' && (
                  <button onClick={() => handleUpdateStatus(viewingContact.contactId, 'replied')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black text-xs font-mono uppercase tracking-widest rounded-lg transition-colors">
                    <CheckCircle size={14} /> Mark as Replied
                  </button>
                )}
                {viewingContact.status !== 'closed' && (
                  <button onClick={() => handleUpdateStatus(viewingContact.contactId, 'closed')} className="w-full sm:w-auto px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-widest rounded-lg transition-colors">
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
