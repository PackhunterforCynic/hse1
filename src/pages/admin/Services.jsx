import React, { useState } from 'react';
import { useLoaderData, Form, useSubmit, useNavigation } from 'react-router';
import { z } from 'zod';
import { db } from '../../lib/db.server';
import { requireAdminSession, logAdminAction } from '../../lib/middleware.server';
import { Edit2, Trash2, Plus, X, Upload, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function loader({ request }) {
  await requireAdminSession(request);
  
  const services = await db.service.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' }
  });

  let mediaLibrary = [];
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'services');
    const files = await fs.readdir(uploadDir);
    mediaLibrary = files.map(f => `/services/${f}`);
  } catch (e) {
    // Directory might not exist yet
  }

  return { services, mediaLibrary };
}

const serviceSchema = z.object({
  serviceName: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  icon: z.string().min(1, "Icon is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  featured: z.preprocess((val) => val === "on", z.boolean()),
});

export async function action({ request }) {
  const admin = await requireAdminSession(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  
  if (intent === "delete") {
    const id = parseInt(formData.get("serviceId"));
    await db.service.update({
      where: { serviceId: id },
      data: { isDeleted: true, deletedAt: new Date() }
    });
    await logAdminAction(admin.id, 'Deleted Service', 'Service', id, request);
    return { success: true };
  }

  // Handle File Upload if present
  const file = formData.get("imageFile");
  if (file && file.size > 0 && file.name) {
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'services');
    await fs.mkdir(uploadDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    
    // Set the icon field to the new local path
    formData.set('icon', `/services/${filename}`);
  }

  const rawData = Object.fromEntries(formData);
  const result = serviceSchema.safeParse(rawData);

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  if (intent === "create") {
    const newService = await db.service.create({ data: result.data });
    await logAdminAction(admin.id, 'Created Service', 'Service', newService.serviceId, request);
  } else if (intent === "update") {
    const id = parseInt(formData.get("serviceId"));
    await db.service.update({
      where: { serviceId: id },
      data: result.data
    });
    await logAdminAction(admin.id, 'Updated Service', 'Service', id, request);
  }

  return { success: true };
}

export default function Services() {
  const { services, mediaLibrary } = useLoaderData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [iconMode, setIconMode] = useState('library'); // 'library', 'upload', 'url'
  const [selectedIcon, setSelectedIcon] = useState('');

  const openCreate = () => {
    setEditingService(null);
    setSelectedIcon('');
    setIconMode(mediaLibrary.length > 0 ? 'library' : 'upload');
    setIsModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setSelectedIcon(service.icon);
    
    if (service.icon.startsWith('/services/')) {
      setIconMode('library');
    } else {
      setIconMode('url');
    }
    
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const formData = new FormData();
      formData.append("intent", "delete");
      formData.append("serviceId", id);
      submit(formData, { method: "post" });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display uppercase tracking-widest text-white">Services</h2>
          <p className="text-white/50 font-sans text-sm mt-1">Manage studio offerings and disciplines.</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black font-mono text-xs uppercase tracking-widest rounded-lg transition-colors"
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-[#050505]">
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Service</th>
                <th className="hidden sm:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Category</th>
                <th className="hidden md:table-cell p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Status</th>
                <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50 text-right md:text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-white/40 font-mono text-xs uppercase">No services found</td>
                </tr>
              ) : services.map(service => (
                <tr key={service.serviceId} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      {service.icon && (
                        <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/10">
                          {service.icon.startsWith('http') || service.icon.startsWith('/services/') ? (
                            <img src={service.icon} alt={service.serviceName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-xs font-mono">{service.icon.substring(0, 3)}</div>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-sans text-white">{service.serviceName}</span>
                        <span className="text-[10px] font-mono text-white/40">{service.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell p-4 text-xs font-mono text-white/60">{service.category}</td>
                  <td className="hidden md:table-cell p-4">
                    <span className={`px-2 py-1 text-[10px] font-mono uppercase tracking-widest rounded-full ${service.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-white/5 text-white/40'}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end md:justify-start gap-2">
                      <button onClick={() => openEdit(service)} className="p-2 text-white/40 hover:text-white transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(service.serviceId)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
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
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-lg font-display uppercase tracking-widest text-white">{editingService ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <Form method="post" encType="multipart/form-data" className="p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar" onSubmit={() => setTimeout(() => setIsModalOpen(false), 100)}>
              <input type="hidden" name="intent" value={editingService ? 'update' : 'create'} />
              {editingService && <input type="hidden" name="serviceId" value={editingService.serviceId} />}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Service Name</label>
                  <input type="text" name="serviceName" defaultValue={editingService?.serviceName} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase text-white/50">Slug (URL)</label>
                  <input type="text" name="slug" defaultValue={editingService?.slug} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-white/50">Category</label>
                <input type="text" name="category" defaultValue={editingService?.category} required className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-mono uppercase text-white/50">Service Image / Icon</label>
                
                <div className="flex gap-2 p-1 bg-white/5 rounded-lg w-fit border border-white/10">
                  <button type="button" onClick={() => setIconMode('library')} className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest rounded flex items-center gap-2 transition-colors ${iconMode === 'library' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
                    <ImageIcon size={14} /> Library
                  </button>
                  <button type="button" onClick={() => setIconMode('upload')} className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest rounded flex items-center gap-2 transition-colors ${iconMode === 'upload' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
                    <Upload size={14} /> Upload
                  </button>
                  <button type="button" onClick={() => setIconMode('url')} className={`px-4 py-1.5 text-xs font-mono uppercase tracking-widest rounded flex items-center gap-2 transition-colors ${iconMode === 'url' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}>
                    <LinkIcon size={14} /> URL
                  </button>
                </div>

                <input type="hidden" name="icon" value={selectedIcon} />

                {iconMode === 'library' && (
                  <div className="border border-white/10 bg-[#050505] rounded-xl p-4">
                    {mediaLibrary.length === 0 ? (
                      <p className="text-white/40 text-xs font-mono text-center py-8">No images found in library.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                        {mediaLibrary.map(path => (
                          <div 
                            key={path} 
                            onClick={() => setSelectedIcon(path)}
                            className={`aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedIcon === path ? 'border-[#D4AF37] scale-[0.98]' : 'border-transparent hover:border-white/20'}`}
                          >
                            <img src={path} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {iconMode === 'upload' && (
                  <div className="border border-dashed border-white/20 bg-[#050505] rounded-xl p-8 flex flex-col items-center justify-center relative hover:border-[#D4AF37]/50 transition-colors">
                    <Upload size={24} className="text-white/30 mb-3" />
                    <p className="text-sm font-sans text-white/50 mb-1">Drag and drop or click to browse</p>
                    <p className="text-[10px] font-mono text-white/30 uppercase">JPG, PNG, WebP (Max 5MB)</p>
                    <input 
                      type="file" 
                      name="imageFile" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          // Clear the hidden input to allow the file to take precedence
                          setSelectedIcon(e.target.files[0].name); // Visual cue
                        }
                      }}
                    />
                  </div>
                )}

                {iconMode === 'url' && (
                  <div className="flex flex-col gap-1">
                    <input 
                      type="url" 
                      value={selectedIcon}
                      onChange={(e) => setSelectedIcon(e.target.value)}
                      placeholder="https://..." 
                      className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm" 
                    />
                  </div>
                )}

                {/* Selected Preview */}
                {selectedIcon && iconMode !== 'upload' && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-[10px] font-mono uppercase text-white/50">Selected:</div>
                    <div className="text-xs font-sans text-[#D4AF37] truncate">{selectedIcon}</div>
                  </div>
                )}
                {iconMode === 'upload' && selectedIcon && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="text-[10px] font-mono uppercase text-white/50">File to upload:</div>
                    <div className="text-xs font-sans text-[#D4AF37] truncate">{selectedIcon}</div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-mono uppercase text-white/50">Description</label>
                <textarea name="description" defaultValue={editingService?.description} required rows={3} className="bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm resize-none"></textarea>
              </div>

              <div className="flex items-center gap-6 mt-2 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <input type="checkbox" name="featured" defaultChecked={editingService?.featured} className="accent-[#D4AF37]" />
                  <label className="text-xs text-white/70">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                  <select name="status" defaultValue={editingService?.status || 'active'} className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs outline-none">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-mono uppercase text-white/50 hover:text-white">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#D4AF37] hover:bg-[#CFA65B] text-black text-xs font-mono uppercase tracking-widest rounded-lg">Save Service</button>
              </div>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
