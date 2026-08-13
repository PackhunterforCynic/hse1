import React, { useState } from 'react';
import { useLoaderData, Form, useSubmit, useNavigation } from 'react-router';
import { z } from 'zod';
import { db } from '../../lib/db.server';
import { requireAdminSession, logAdminAction } from '../../lib/middleware.server';
import { Edit2, Trash2, Plus, X, Star } from 'lucide-react';

export async function loader({ request }) {
  await requireAdminSession(request);
  const testimonials = await db.testimonial.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' }
  });
  return { testimonials };
}

const testimonialSchema = z.object({
  clientName: z.string().min(1, "Client Name is required"),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional(),
  designation: z.string().optional(),
  profilePhoto: z.string().optional(),
  review: z.string().min(1, "Review is required"),
  rating: z.preprocess((val) => parseInt(val), z.number().min(1).max(5)),
  featured: z.preprocess((val) => val === "on", z.boolean()),
  approved: z.preprocess((val) => val === "on", z.boolean()),
});

export async function action({ request }) {
  const admin = await requireAdminSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  if (intent === "delete") {
    const id = parseInt(formData.get("testimonialId"));
    await db.testimonial.update({
      where: { testimonialId: id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    await logAdminAction(admin.id, 'Deleted Testimonial', 'Testimonial', id, request);
    return { success: true };
  }

  const rawData = Object.fromEntries(formData);
  const result = testimonialSchema.safeParse(rawData);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  if (intent === "create") {
    const newTestimonial = await db.testimonial.create({ data: result.data });
    await logAdminAction(admin.id, 'Created Testimonial', 'Testimonial', newTestimonial.testimonialId, request);
  } else if (intent === "update") {
    const id = parseInt(formData.get("testimonialId"));
    await db.testimonial.update({
      where: { testimonialId: id },
      data: result.data
    });
    await logAdminAction(admin.id, 'Updated Testimonial', 'Testimonial', id, request);
  }

  return { success: true };
}

export default function Testimonials() {
  const { testimonials } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  const openCreate = () => {
    setEditingTestimonial(null);
    setIsModalOpen(true);
  };

  const openEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this testimonial?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("testimonialId", id);
      submit(formData, { method: "post" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-widest text-white">Testimonials</h2>
          <p className="text-white/50 font-sans text-sm mt-1">Manage client reviews and feedback.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black font-mono text-xs uppercase tracking-widest rounded-lg transition-colors"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#050505]">
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Client</th>
                <th className="hidden sm:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Rating</th>
                <th className="hidden md:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Status</th>
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50 text-right md:text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-white/40 font-mono text-xs uppercase">No testimonials found</td>
                </tr>
              ) : testimonials.map(t => (
                <tr key={t.testimonialId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-sans text-white">{t.clientName}</span>
                      <span className="text-[10px] font-mono text-white/40">{t.designation || 'Client'} {t.company ? `@ ${t.company}` : ''}</span>
                      {(t.email || t.phone) && (
                        <span className="text-[10px] font-mono text-[#D4AF37]/70 mt-1">
                          {t.email} {t.phone && `| ${t.phone}`}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="hidden sm:table-cell p-4">
                    <div className="flex gap-1 text-[#D4AF37]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill={i < t.rating ? "currentColor" : "none"} className={i >= t.rating ? "text-white/20" : ""} />
                      ))}
                    </div>
                  </td>
                  <td className="hidden md:table-cell p-4">
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full ${t.approved ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                        {t.approved ? 'Approved' : 'Pending'}
                      </span>
                      {t.featured && (
                        <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end md:justify-start gap-2">
                      <button onClick={() => openEdit(t)} className="p-2 text-white/40 hover:text-white transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(t.testimonialId)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">{editingTestimonial ? 'Edit Review' : 'Add Review'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <Form method="post" className="p-6 overflow-y-auto flex flex-col gap-4 custom-scrollbar" onSubmit={() => setTimeout(() => setIsModalOpen(false), 100)}>
              <input type="hidden" name="intent" value={editingTestimonial ? 'update' : 'create'} />
              {editingTestimonial && <input type="hidden" name="testimonialId" value={editingTestimonial.testimonialId} />}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Client Name</label>
                  <input type="text" name="clientName" defaultValue={editingTestimonial?.clientName} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Rating (1-5)</label>
                  <input type="number" name="rating" min="1" max="5" defaultValue={editingTestimonial?.rating || 5} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Email</label>
                  <input type="email" name="email" defaultValue={editingTestimonial?.email || ''} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Phone</label>
                  <input type="text" name="phone" defaultValue={editingTestimonial?.phone || ''} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Company</label>
                  <input type="text" name="company" defaultValue={editingTestimonial?.company} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Designation</label>
                  <input type="text" name="designation" defaultValue={editingTestimonial?.designation} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-white/50">Profile Photo URL</label>
                <input type="text" name="profilePhoto" defaultValue={editingTestimonial?.profilePhoto} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-white/50">Review Content</label>
                <textarea name="review" defaultValue={editingTestimonial?.review} required rows={4} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm resize-none"></textarea>
              </div>

              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="approved" id="approved" defaultChecked={editingTestimonial?.approved !== false} className="accent-green-500" />
                  <label htmlFor="approved" className="text-xs text-white/70">Approved for public viewing</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="featured" id="featured" defaultChecked={editingTestimonial?.featured} className="accent-[#D4AF37]" />
                  <label htmlFor="featured" className="text-xs text-[#D4AF37]">Featured</label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-mono uppercase text-white/50 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black text-xs font-mono uppercase tracking-widest rounded-lg">Save</button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
