import React from 'react';
import { useLoaderData, Form, useSubmit } from 'react-router';
import { db } from '../../lib/db.server';
import { requireSuperAdmin } from '../../lib/middleware.server';
import { Shield, ShieldAlert } from 'lucide-react';

export async function loader({ request }) {
  await requireSuperAdmin(request);
  
  // Fetch full audit logs
  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100 // Limit to last 100 for performance
  });

  // Fetch all admins
  const admins = await db.admin.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return { logs, admins };
}

export default function Settings() {
  const { logs, admins } = useLoaderData();

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h2 className="text-2xl font-display uppercase tracking-widest text-white">System Settings</h2>
        <p className="text-white/50 font-sans text-sm mt-1">Superadmin access only. View audit logs and manage team access.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Admin Team List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <h3 className="text-lg font-mono uppercase tracking-widest text-white flex items-center gap-2">
            <Shield size={18} className="text-[#D4AF37]" /> Team Access
          </h3>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col gap-4">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex flex-col">
                  <span className="text-sm font-sans text-white">{admin.email}</span>
                  <span className={`text-[10px] font-mono uppercase mt-1 ${admin.role === 'superadmin' ? 'text-[#D4AF37]' : 'text-white/40'}`}>
                    {admin.role}
                  </span>
                </div>
                {admin.role !== 'superadmin' && (
                  <button className="text-xs font-mono text-red-400 hover:text-red-300">Revoke</button>
                )}
              </div>
            ))}
            <button className="w-full py-3 mt-2 border border-dashed border-white/10 hover:border-white/30 text-white/50 hover:text-white rounded-xl text-xs font-mono uppercase tracking-widest transition-colors">
              + Invite Admin
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h3 className="text-lg font-mono uppercase tracking-widest text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-blue-400" /> Security Audit Log
          </h3>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden h-[600px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-[#050505] z-10 border-b border-white/5">
                <tr>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Action</th>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Entity</th>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Admin ID</th>
                  <th className="p-4 text-[10px] font-mono tracking-widest uppercase text-white/50">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-white/40 font-mono text-xs uppercase">No logs recorded</td>
                  </tr>
                ) : logs.map(log => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-xs font-sans text-white/90">{log.action}</td>
                    <td className="p-4 text-xs font-mono text-white/50">
                      <span className="text-white/80">{log.entity}</span> {log.entityId && `#${log.entityId}`}
                    </td>
                    <td className="p-4 text-xs font-mono text-white/50">{log.adminId ? `Admin #${log.adminId}` : 'System'}</td>
                    <td className="p-4 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
