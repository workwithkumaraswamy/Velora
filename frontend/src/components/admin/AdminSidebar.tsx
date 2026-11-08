import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Truck,
  Sparkles,
  Download,
  ShoppingBag,
  Tag,
  RotateCcw,
  Headphones,
  Users,
  BarChart3,
  ExternalLink,
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const role = user?.role || 'CUSTOMER';

  const isSuperAdmin = role === 'SUPER_ADMIN';
  const isOrderManager = isSuperAdmin || role === 'ORDER_MANAGER';
  const isSupportManager = isSuperAdmin || role === 'SUPPORT_MANAGER';
  const isCatalogManager = isSuperAdmin || ['MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER'].includes(role);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, show: true },
    { name: 'Products Catalog', href: '/admin/products', icon: Package, show: isCatalogManager },
    { name: 'Add Product', href: '/admin/products/new', icon: PlusCircle, show: isCatalogManager },
    { name: 'AI Product Studio', href: '/admin/ai-studio', icon: Sparkles, show: isCatalogManager },
    { name: 'Import Supplier Product', href: '/admin/import', icon: Download, show: isCatalogManager },
    { name: 'Suppliers Directory', href: '/admin/suppliers', icon: Truck, show: isOrderManager },
    { name: 'Supplier Orders', href: '/admin/supplier-orders', icon: ShoppingBag, show: isOrderManager },
    { name: 'Customer Orders', href: '/admin/orders', icon: ShoppingBag, show: isOrderManager || isCatalogManager },
    { name: 'Coupons & Promos', href: '/admin/coupons', icon: Tag, show: isSuperAdmin },
    { name: 'Returns & Refunds', href: '/admin/returns', icon: RotateCcw, show: isSupportManager },
    { name: 'Support Concierge', href: '/admin/support', icon: Headphones, show: isSupportManager },
    { name: 'Staff & Managers', href: '/admin/staff', icon: Users, show: isSuperAdmin },
    { name: 'Business Analytics', href: '/admin/analytics', icon: BarChart3, show: isSuperAdmin || isCatalogManager },
  ];

  return (
    <aside className="w-64 bg-velora-black text-neutral-300 flex flex-col justify-between h-screen sticky top-0 border-r border-neutral-800 flex-shrink-0">
      <div>
        {/* Brand header */}
        <div className="p-6 border-b border-neutral-800">
          <Link to="/" className="block">
            <span className="font-serif text-2xl font-light tracking-[0.25em] text-white">
              VÉLORA
            </span>
          </Link>
          <div className="flex items-center space-x-1.5 mt-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] tracking-widest uppercase text-velora-champagne font-medium">
              Enterprise Suite
            </span>
          </div>
        </div>

        {/* Current User Badge */}
        <div className="px-6 py-3.5 bg-neutral-900/60 border-b border-neutral-800 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-velora-champagne-dark text-white font-bold text-xs flex items-center justify-center">
            {user?.firstName?.[0] || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] text-velora-champagne font-mono truncate">
              {role}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] no-scrollbar">
          {navItems.filter(it => it.show).map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/admin'}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-velora-champagne text-velora-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-2 bg-neutral-950">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900"
        >
          <span className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Marketplace</span>
          </span>
          <span className="text-[10px] text-velora-champagne">LIVE</span>
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
