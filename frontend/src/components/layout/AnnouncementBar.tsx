import React from 'react';
import { Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-velora-black text-velora-cream text-[11px] uppercase tracking-widest py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-4 text-neutral-400">
          <span>INDIA (₹ INR)</span>
          <span>•</span>
          <span>EXPRESS DROPSHIPPING</span>
        </div>

        <div className="flex items-center justify-center space-x-2 text-center w-full md:w-auto">
          <Sparkles className="w-3.5 h-3.5 text-velora-champagne animate-pulse" />
          <span className="font-light">
            Complimentary shipping on orders above <span className="font-medium text-velora-champagne">₹1,499</span> — Use code <span className="font-semibold text-white tracking-widest">WELCOME10</span> for 10% off
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-neutral-400">
          <a href="/track-order" className="hover:text-white transition-colors">Track Order</a>
          <span>•</span>
          <a href="/account/tickets" className="hover:text-white transition-colors">Concierge</a>
        </div>
      </div>
    </div>
  );
};
