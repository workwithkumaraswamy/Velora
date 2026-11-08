import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Package, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { MegaMenu } from './MegaMenu';
import { MobileNav } from './MobileNav';

export const Navbar: React.FC = () => {
  const [activeMegaMenu, setActiveMegaMenu] = useState<'men' | 'women' | 'kids' | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItemsCount = useCartStore((s) => s.getItemsCount());
  const openCartDrawer = useCartStore((s) => s.openDrawer);
  const wishlistCount = useWishlistStore((s) => s.getCount());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveMegaMenu(null);
    setIsMobileNavOpen(false);
    setIsAccountMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Click outside listener for account dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/men?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 bg-velora-cream/95 backdrop-blur-md border-b ${
          isScrolled ? 'border-velora-border shadow-sm' : 'border-velora-border/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 text-velora-black hover:text-velora-champagne focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link to="/" className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-normal tracking-[0.25em] text-velora-black uppercase">
                  VÉLORA
                </span>
                <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.35em] text-velora-champagne-dark font-medium -mt-0.5">
                  Haute Marketplace
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8 h-full">
              <Link
                to="/"
                className="text-xs uppercase tracking-[0.18em] font-medium text-velora-black hover:text-velora-champagne transition-colors py-8"
              >
                Home
              </Link>

              {/* Men with Mega Menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu('men')}
              >
                <Link
                  to="/men"
                  className="text-xs uppercase tracking-[0.18em] font-medium text-velora-black hover:text-velora-champagne transition-colors flex items-center py-8"
                >
                  <span>Men</span>
                  <ChevronDown className="w-3 h-3 ml-1 text-neutral-400" />
                </Link>
              </div>

              {/* Women with Mega Menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu('women')}
              >
                <Link
                  to="/women"
                  className="text-xs uppercase tracking-[0.18em] font-medium text-velora-black hover:text-velora-champagne transition-colors flex items-center py-8"
                >
                  <span>Women</span>
                  <ChevronDown className="w-3 h-3 ml-1 text-neutral-400" />
                </Link>
              </div>

              {/* Kids with Mega Menu */}
              <div
                className="relative h-full flex items-center"
                onMouseEnter={() => setActiveMegaMenu('kids')}
              >
                <Link
                  to="/kids"
                  className="text-xs uppercase tracking-[0.18em] font-medium text-velora-black hover:text-velora-champagne transition-colors flex items-center py-8"
                >
                  <span>Kids</span>
                  <ChevronDown className="w-3 h-3 ml-1 text-neutral-400" />
                </Link>
              </div>

              <Link
                to="/men?isNewArrival=true"
                className="text-xs uppercase tracking-[0.18em] font-medium text-velora-black hover:text-velora-champagne transition-colors flex items-center py-8"
              >
                <Sparkles className="w-3 h-3 mr-1 text-velora-champagne" />
                <span>New Arrivals</span>
              </Link>

              <Link
                to="/women?isTrending=true"
                className="text-xs uppercase tracking-[0.18em] font-medium text-velora-black hover:text-velora-champagne transition-colors py-8"
              >
                Trending
              </Link>
            </nav>

            {/* Right: Actions (Search, Account, Wishlist, Cart) */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search Trigger */}
              <button
                onClick={() => {
                  setIsSearchOpen(!isSearchOpen);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="p-2 text-velora-black hover:text-velora-champagne transition-colors"
                aria-label="Search catalog"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2 text-velora-black hover:text-velora-champagne transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-velora-champagne text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                className="relative p-2 text-velora-black hover:text-velora-champagne transition-colors"
                aria-label="Shopping bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-velora-black text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Account Dropdown */}
              <div className="relative" ref={accountMenuRef}>
                {isAuthenticated && user ? (
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="flex items-center space-x-1.5 p-2 text-velora-black hover:text-velora-champagne transition-colors focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-velora-sand border border-velora-border flex items-center justify-center text-xs font-semibold uppercase text-velora-black">
                      {user.firstName[0]}
                    </div>
                    <ChevronDown className="w-3 h-3 hidden sm:inline-block text-neutral-400" />
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-velora-black hover:text-velora-champagne transition-colors flex items-center"
                    aria-label="Sign in"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}

                {/* Dropdown Menu */}
                {isAccountMenuOpen && isAuthenticated && user && (
                  <div className="absolute right-0 mt-2 w-56 bg-velora-cream border border-velora-border shadow-xl py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-velora-border">
                      <p className="text-xs font-medium text-velora-black">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] uppercase tracking-wider bg-velora-sand text-velora-charcoal font-semibold">
                        {user.role}
                      </span>
                    </div>

                    {user.role !== 'CUSTOMER' && (
                      <div className="py-1 border-b border-velora-border bg-amber-50/50">
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-xs font-semibold text-rose-800 hover:bg-amber-100"
                        >
                          <ShieldCheck className="w-4 h-4 mr-2" />
                          <span>Admin & Staff Portal</span>
                        </Link>
                      </div>
                    )}

                    <div className="py-1">
                      <Link
                        to="/account"
                        className="flex items-center px-4 py-2 text-xs text-neutral-700 hover:bg-velora-beige"
                      >
                        <User className="w-3.5 h-3.5 mr-2" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/account/orders"
                        className="flex items-center px-4 py-2 text-xs text-neutral-700 hover:bg-velora-beige"
                      >
                        <Package className="w-3.5 h-3.5 mr-2" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/account/addresses"
                        className="flex items-center px-4 py-2 text-xs text-neutral-700 hover:bg-velora-beige"
                      >
                        <span>Saved Addresses</span>
                      </Link>
                      <Link
                        to="/account/returns"
                        className="flex items-center px-4 py-2 text-xs text-neutral-700 hover:bg-velora-beige"
                      >
                        <span>Returns & Exchanges</span>
                      </Link>
                      <Link
                        to="/account/tickets"
                        className="flex items-center px-4 py-2 text-xs text-neutral-700 hover:bg-velora-beige"
                      >
                        <span>Support Desk</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-velora-border">
                      <button
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-xs text-rose-700 hover:bg-rose-50"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-velora-border bg-velora-ivory py-4 px-4 sm:px-8 animate-in slide-in-from-top duration-200">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search double-breasted blazers, Banarasi silks, Italian loafers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-velora-border py-3 pl-12 pr-12 text-sm text-velora-black placeholder-neutral-400 focus:outline-none focus:border-velora-champagne shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-4 p-1 text-neutral-400 hover:text-velora-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-2.5 flex items-center space-x-2 text-[11px] text-neutral-500">
                <span className="uppercase tracking-wider font-medium text-velora-black">Popular:</span>
                <button onClick={() => { setSearchQuery('Blazer'); navigate('/men?search=Blazer'); setIsSearchOpen(false); }} className="hover:underline">Blazers</button>
                <span>•</span>
                <button onClick={() => { setSearchQuery('Silk Saree'); navigate('/women?search=Saree'); setIsSearchOpen(false); }} className="hover:underline">Silk Sarees</button>
                <span>•</span>
                <button onClick={() => { setSearchQuery('Oxford'); navigate('/men?search=Oxford'); setIsSearchOpen(false); }} className="hover:underline">Oxford Shoes</button>
                <span>•</span>
                <button onClick={() => { setSearchQuery('Kurta'); navigate('/kids?search=Kurta'); setIsSearchOpen(false); }} className="hover:underline">Kids Festive</button>
              </div>
            </div>
          </div>
        )}

        {/* Mega Menus */}
        {activeMegaMenu && (
          <MegaMenu
            department={activeMegaMenu}
            isOpen={!!activeMegaMenu}
            onClose={() => setActiveMegaMenu(null)}
          />
        )}
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
};
