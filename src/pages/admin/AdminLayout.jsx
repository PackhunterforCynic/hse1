import React, { useState } from 'react';
import { Outlet, NavLink, useLoaderData, Form, redirect } from 'react-router';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Image as ImageIcon, 
  Settings,
  LogOut,
  Menu,
  X,
  Mail
} from 'lucide-react';
import { requireAdminSession } from '../../lib/middleware.server';
import { logout } from '../../lib/session.server';

// Protect the entire /admin route
export async function loader({ request }) {
  const admin = await requireAdminSession(request);
  return { admin };
}

// Handle global logout action
export async function action({ request }) {
  const formData = await request.formData();
  if (formData.get("intent") === "logout") {
    return logout(request);
  }
  return null;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Services', path: '/admin/services', icon: Briefcase },
  { name: 'Internships', path: '/admin/internships', icon: Users },
  { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
  { name: 'Contacts', path: '/admin/contacts', icon: Mail },
];

export default function AdminLayout() {
  const { admin } = useLoaderData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <h1 className="text-xl font-display uppercase tracking-widest text-white">Havilah <span className="text-[#D4AF37]">Admin</span></h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.exact}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white border border-transparent'
                }
              `}
            >
              <item.icon size={18} className="shrink-0" />
              <span className="font-mono text-xs uppercase tracking-wider">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/5 shrink-0 bg-[#070707]">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex flex-col">
              <span className="text-xs font-sans text-white/40 truncate w-32">{admin.email}</span>
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{admin.role}</span>
            </div>
            <NavLink to="/admin/settings" className="text-white/40 hover:text-white transition-colors p-1">
              <Settings size={16} />
            </NavLink>
          </div>
          
          <Form method="post">
            <input type="hidden" name="intent" value="logout" />
            <button 
              type="submit" 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all text-xs font-mono uppercase tracking-wider"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </Form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Topbar (mostly for mobile spacing, or global search later) */}
        <header className="h-20 flex items-center px-6 lg:px-10 shrink-0 sticky top-0 bg-[#050505]/80 backdrop-blur-md z-30 border-b border-transparent">
          {/* We can add Breadcrumbs or Search here in Phase 5 */}
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10 relative">
          <Outlet />
        </div>
      </main>

      {/* Mobile overlay backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
