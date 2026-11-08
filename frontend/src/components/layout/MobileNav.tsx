import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, User, Heart, ShoppingBag, Search, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const cartCount = useCartStore((s) => s.getItemsCount());

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/men?search=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-5/6 max-w-sm bg-velora-cream border-r border-velora-border shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-velora-border">
            <Link to="/" onClick={onClose} className="font-serif text-2xl font-bold tracking-widest text-velora-black">
              VÉLORA
            </Link>
            <button onClick={onClose} className="p-1.5 text-velora-muted hover:text-velora-black">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="p-4 border-b border-velora-border">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cashmere, silk dresses, loafers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-velora-border py-2.5 pl-9 pr-4 text-xs text-velora-black placeholder-neutral-400 focus:outline-none focus:border-velora-champagne"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </form>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="block py-2.5 px-3 text-xs uppercase tracking-widest font-medium text-velora-black hover:bg-velora-beige"
            >
              Home
            </Link>

            {/* Men Accordion */}
            <div>
              <button
                onClick={() => toggleSection('men')}
                className="w-full flex items-center justify-between py-2.5 px-3 text-xs uppercase tracking-widest font-medium text-velora-black hover:bg-velora-beige"
              >
                <span>Men</span>
                {openSection === 'men' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {openSection === 'men' && (
                <div className="pl-6 pr-3 py-2 space-y-2 bg-velora-ivory border-l-2 border-velora-champagne my-1">
                  <Link to="/men" onClick={onClose} className="block text-xs text-velora-champagne-dark font-medium py-1">
                    Explore All Men’s Wear →
                  </Link>
                  <Link to="/men?category=shirts" onClick={onClose} className="block text-xs text-neutral-600 py-1">Shirts & Polos</Link>
                  <Link to="/men?category=jackets" onClick={onClose} className="block text-xs text-neutral-600 py-1">Jackets & Blazers</Link>
                  <Link to="/men?category=shoes" onClick={onClose} className="block text-xs text-neutral-600 py-1">Footwear & Loafers</Link>
                  <Link to="/men?category=watches" onClick={onClose} className="block text-xs text-neutral-600 py-1">Watches & Horology</Link>
                </div>
              )}
            </div>

            {/* Women Accordion */}
            <div>
              <button
                onClick={() => toggleSection('women')}
                className="w-full flex items-center justify-between py-2.5 px-3 text-xs uppercase tracking-widest font-medium text-velora-black hover:bg-velora-beige"
              >
                <span>Women</span>
                {openSection === 'women' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {openSection === 'women' && (
                <div className="pl-6 pr-3 py-2 space-y-2 bg-velora-ivory border-l-2 border-velora-champagne my-1">
                  <Link to="/women" onClick={onClose} className="block text-xs text-velora-champagne-dark font-medium py-1">
                    Explore All Women’s Wear →
                  </Link>
                  <Link to="/women?category=dresses" onClick={onClose} className="block text-xs text-neutral-600 py-1">Dresses & Evening Gowns</Link>
                  <Link to="/women?category=ethnic-wear" onClick={onClose} className="block text-xs text-neutral-600 py-1">Kashi Banarasi & Sarees</Link>
                  <Link to="/women?category=handbags" onClick={onClose} className="block text-xs text-neutral-600 py-1">Handbags & Totes</Link>
                  <Link to="/women?category=jewellery" onClick={onClose} className="block text-xs text-neutral-600 py-1">Fine Jewellery</Link>
                </div>
              )}
            </div>

            {/* Kids Accordion */}
            <div>
              <button
                onClick={() => toggleSection('kids')}
                className="w-full flex items-center justify-between py-2.5 px-3 text-xs uppercase tracking-widest font-medium text-velora-black hover:bg-velora-beige"
              >
                <span>Kids</span>
                {openSection === 'kids' ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {openSection === 'kids' && (
                <div className="pl-6 pr-3 py-2 space-y-2 bg-velora-ivory border-l-2 border-velora-champagne my-1">
                  <Link to="/kids" onClick={onClose} className="block text-xs text-velora-champagne-dark font-medium py-1">
                    Explore All Kids’ Wear →
                  </Link>
                  <Link to="/kids?category=boys-clothing" onClick={onClose} className="block text-xs text-neutral-600 py-1">Boys Clothing</Link>
                  <Link to="/kids?category=girls-clothing" onClick={onClose} className="block text-xs text-neutral-600 py-1">Girls Dresses</Link>
                  <Link to="/kids?category=kids-ethnic" onClick={onClose} className="block text-xs text-neutral-600 py-1">Festive Sets</Link>
                </div>
              )}
            </div>

            <Link
              to="/men?isNewArrival=true"
              onClick={onClose}
              className="flex items-center space-x-2 py-2.5 px-3 text-xs uppercase tracking-widest font-medium text-velora-champagne-dark hover:bg-velora-beige"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </Link>

            <Link
              to="/women?isTrending=true"
              onClick={onClose}
              className="block py-2.5 px-3 text-xs uppercase tracking-widest font-medium text-velora-black hover:bg-velora-beige"
            >
              Trending Now
            </Link>

            {user?.role && user.role !== 'CUSTOMER' && (
              <Link
                to="/admin"
                onClick={onClose}
                className="block py-2.5 px-3 text-xs uppercase tracking-widest font-semibold text-rose-700 bg-rose-50 border border-rose-200 mt-2"
              >
                ⚡ Management Portal ({user.role})
              </Link>
            )}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-velora-border bg-velora-ivory space-y-3">
          <div className="flex items-center justify-around py-2 border-b border-velora-border text-xs text-velora-black">
            <Link to="/wishlist" onClick={onClose} className="flex items-center space-x-1.5 hover:text-velora-champagne">
              <Heart className="w-4 h-4" />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
            <span>•</span>
            <Link to="/cart" onClick={onClose} className="flex items-center space-x-1.5 hover:text-velora-champagne">
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({cartCount})</span>
            </Link>
          </div>

          {isAuthenticated && user ? (
            <div className="space-y-2">
              <Link
                to="/account"
                onClick={onClose}
                className="w-full flex items-center justify-center py-2.5 bg-velora-black text-white text-xs uppercase tracking-wider font-medium"
              >
                <User className="w-3.5 h-3.5 mr-2" />
                <span>My Account ({user.firstName})</span>
              </Link>
              <button
                onClick={() => { logout(); onClose(); }}
                className="w-full py-2 text-center text-xs text-neutral-500 uppercase tracking-wider hover:text-velora-black"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={onClose}
                className="text-center py-2.5 bg-velora-black text-white text-xs uppercase tracking-wider font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="text-center py-2.5 bg-white border border-velora-border text-velora-black text-xs uppercase tracking-wider font-medium"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
