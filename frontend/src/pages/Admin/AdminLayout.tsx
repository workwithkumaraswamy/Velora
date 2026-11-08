import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Bell, ShieldCheck, User } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Enforce staff/admin roles
  if (user?.role === 'CUSTOMER') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-velora-black">Access Restricted</h2>
        <p className="text-xs text-neutral-500">
          This portal is reserved for VÉLORA Super Administrators and Department Managers.
        </p>
        <Link to="/" className="inline-block text-xs uppercase tracking-wider font-semibold text-velora-black underline">
          Return to Marketplace Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-100/70 text-velora-black font-sans">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Admin Top Header */}
        <header className="h-16 bg-white border-b border-velora-border px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold">
              Management Console
            </span>
            <span>•</span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
              {user?.role.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center space-x-5 text-xs text-neutral-600">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-medium text-neutral-700">Encrypted Enterprise Session</span>
            </div>
            <div className="h-4 w-px bg-neutral-300" />
            <span className="font-medium text-velora-black">
              {user?.firstName} {user?.lastName}
            </span>
          </div>
        </header>

        {/* Content View */}
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
