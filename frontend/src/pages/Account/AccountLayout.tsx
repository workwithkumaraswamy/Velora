import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { User, Package, MapPin, RotateCcw, Headphones, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AccountLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const links = [
    { name: 'My Profile', href: '/account', icon: User, end: true },
    { name: 'My Orders', href: '/account/orders', icon: Package },
    { name: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
    { name: 'Returns & Refunds', href: '/account/returns', icon: RotateCcw },
    { name: 'Support Concierge', href: '/account/tickets', icon: Headphones },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="pb-8 border-b border-velora-border">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
          Patron Dashboard
        </span>
        <h1 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Account Sidebar Navigation */}
        <aside className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-medium transition-colors ${
                  isActive
                    ? 'bg-velora-black text-white font-semibold'
                    : 'text-neutral-600 hover:bg-velora-beige hover:text-velora-black'
                }`
              }
            >
              <link.icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-xs uppercase tracking-wider font-medium text-rose-700 hover:bg-rose-50 transition-colors mt-4 text-left"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Content Outlet */}
        <main className="md:col-span-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
