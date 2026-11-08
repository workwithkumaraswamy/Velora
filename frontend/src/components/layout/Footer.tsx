import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { Button } from '../common/Button';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-velora-black text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      {/* Brand Value Props Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-neutral-800 grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
          <Award className="w-8 h-8 text-velora-champagne flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Authentic Curation</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Directly sourced from certified master artisan suppliers.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
          <Truck className="w-8 h-8 text-velora-champagne flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Express Dispatch</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Tracked delivery across India with 3-day express fulfillment.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
          <RefreshCw className="w-8 h-8 text-velora-champagne flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">7-Day Concierge Return</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Hassle-free doorstep pickup and rapid refund resolution.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3">
          <ShieldCheck className="w-8 h-8 text-velora-champagne flex-shrink-0" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-white">Razorpay Secure</h4>
            <p className="text-[11px] text-neutral-400 mt-1">Encrypted UPI, Cards, NetBanking and Cash on Delivery.</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl font-normal tracking-[0.25em] text-white uppercase">
              VÉLORA
            </span>
          </Link>
          <p className="text-xs text-neutral-400 leading-relaxed font-light max-w-sm">
            Fashion Without Limits. VÉLORA is India’s premier multi-category fashion dropshipping marketplace, curating bespoke luxury, tailored apparel, footwear and accessories for Men, Women and Kids.
          </p>
          <div className="pt-2 text-xs text-velora-champagne-light">
            <span>Customer Concierge: </span>
            <a href="mailto:concierge@velorafashion.com" className="hover:underline">concierge@velorafashion.com</a>
          </div>
        </div>

        {/* Departments */}
        <div className="space-y-3">
          <h5 className="text-xs uppercase tracking-widest text-white font-semibold">Collections</h5>
          <ul className="space-y-2 text-xs text-neutral-400 font-light">
            <li><Link to="/men" className="hover:text-white transition-colors">Men’s Sartorial</Link></li>
            <li><Link to="/women" className="hover:text-white transition-colors">Women’s Haute Wear</Link></li>
            <li><Link to="/kids" className="hover:text-white transition-colors">Kids’ Boutique</Link></li>
            <li><Link to="/men?isNewArrival=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/women?isTrending=true" className="hover:text-white transition-colors">Trending Now</Link></li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="space-y-3">
          <h5 className="text-xs uppercase tracking-widest text-white font-semibold">Customer Care</h5>
          <ul className="space-y-2 text-xs text-neutral-400 font-light">
            <li><Link to="/track-order" className="hover:text-white transition-colors">Track Your Order</Link></li>
            <li><Link to="/account/returns" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/account/tickets" className="hover:text-white transition-colors">Concierge Desk</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shipping & Delivery Policy</Link></li>
            <li><Link to="/login" className="hover:text-white transition-colors">My Account</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h5 className="text-xs uppercase tracking-widest text-white font-semibold">The VÉLORA Journal</h5>
          <p className="text-xs text-neutral-400 font-light leading-relaxed">
            Receive exclusive seasonal curations, private sale invitations, and 10% off your premier order.
          </p>

          {subscribed ? (
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 p-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>You are subscribed. Use code WELCOME10 at checkout!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-neutral-900 border border-neutral-700 py-2.5 pl-3 pr-10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-velora-champagne"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute right-3 top-3" />
              </div>
              <Button type="submit" variant="champagne" size="sm" className="w-full">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
        <p>© 2026 VÉLORA Haute Marketplace Ltd. All rights reserved.</p>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">Secure Payments:</span>
          <span className="font-mono text-neutral-300">RAZORPAY</span>
          <span>•</span>
          <span className="font-mono text-neutral-300">UPI</span>
          <span>•</span>
          <span className="font-mono text-neutral-300">CASH ON DELIVERY</span>
        </div>
      </div>
    </footer>
  );
};
