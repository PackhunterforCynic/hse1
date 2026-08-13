import React from 'react';
import { useLoaderData, Link } from 'react-router';
import { db } from '../../lib/db.server';
import { Briefcase, Users, MessageSquare, Mail, Activity, ArrowUpRight } from 'lucide-react';

export async function loader() {
  const [servicesCount, requestsCount, applicationsCount, unreadContactsCount, recentLogs] = await Promise.all([
    db.service.count({ where: { isDeleted: false } }),
    db.serviceRequest.count({ where: { status: 'Pending', isDeleted: false } }),
    db.internshipApplication.count({ where: { applicationStatus: 'pending', isDeleted: false } }),
    db.contact.count({ where: { status: 'pending', isDeleted: false } }),
    db.activityLog.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    stats: {
      services: servicesCount,
      requests: requestsCount,
      applications: applicationsCount,
      unreadContacts: unreadContactsCount,
    },
    recentLogs
  };
}

export default function Dashboard() {
  const { stats, recentLogs } = useLoaderData();

  const STAT_CARDS = [
    { label: "Active Services", value: stats.services, icon: Briefcase, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Pending Requests", value: stats.requests, icon: Activity, color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10" },
    { label: "New Applications", value: stats.applications, icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
    { label: "Unread Messages", value: stats.unreadContacts, icon: Mail, color: "text-red-400", bg: "bg-red-400/10" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-display uppercase tracking-widest text-white mb-2">Overview</h2>
        <p className="text-white/50 font-sans font-light text-sm">Welcome back. Here's what's happening at Havilah Studio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((stat, idx) => (
          <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight size={20} className="text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-4xl font-display text-white mb-1">{stat.value}</h3>
              <p className="text-[10px] font-mono tracking-widest uppercase text-white/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-mono uppercase tracking-widest text-white">Recent Activity</h3>
          <Link to="/admin/settings" className="text-xs font-mono uppercase text-[#D4AF37] hover:text-white transition-colors">View All Logs</Link>
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
          {recentLogs.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Activity size={32} className="text-white/10 mb-4" />
              <p className="text-white/40 font-mono text-sm uppercase">No activity recorded yet</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <tbody>
                {recentLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                        <span className="text-sm font-sans text-white/90">{log.action}</span>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-white/50">
                      Entity: <span className="text-white/80">{log.entity}</span> {log.entityId && `#${log.entityId}`}
                    </td>
                    <td className="p-4 pr-6 text-right text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
