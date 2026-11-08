import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const LoginPage: React.FC = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const user = await login(credential, password);
      if (user.role !== 'CUSTOMER') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials');
    }
  };

  const handleQuickLogin = (email: string, pass: string) => {
    setCredential(email);
    setPassword(pass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-champagne-dark">
          Exclusive Membership
        </span>
        <h1 className="font-serif text-3xl text-velora-black font-normal">
          Sign In To VÉLORA
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Access your bespoke orders, saved addresses and curated wishlist.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorMsg}
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-velora-border p-8 space-y-5 shadow-sm">
        <div className="space-y-1">
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
            Email or Registered Phone
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="name@velorafashion.com or +91..."
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              className="w-full bg-white border border-velora-border py-2.5 pl-3 pr-9 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <label className="uppercase tracking-wider font-semibold text-velora-black">
              Password
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please use one of the demo logins below or contact concierge@velora.com to reset.'); }} className="text-neutral-400 hover:text-black">
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-velora-border py-2.5 pl-3 pr-9 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
            <Lock className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isLoading}
          className="w-full tracking-widest text-xs py-3.5"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Sign In To Account
        </Button>

        <p className="text-center text-xs text-neutral-500 pt-2">
          New to VÉLORA?{' '}
          <Link to="/register" className="text-velora-black font-semibold uppercase tracking-wider hover:underline">
            Register An Account
          </Link>
        </p>
      </form>

      {/* Instant 1-Click Demo Logins for Pair Programming & Testing */}
      <div className="bg-velora-beige/60 border border-velora-border p-5 space-y-3">
        <div className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-velora-black">
          <Sparkles className="w-4 h-4 text-velora-champagne-dark" />
          <span>Instant 1-Click Demo Credentials:</span>
        </div>
        <p className="text-[11px] text-neutral-500 leading-relaxed font-light">
          Click any persona below to auto-fill verified credentials:
        </p>
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@velora.com', 'VeloraAdmin2026!')}
            className="p-2 bg-white border border-velora-border hover:border-black text-left font-medium transition-colors"
          >
            👑 <strong>Super Admin</strong>
            <span className="block text-[9px] text-neutral-400 truncate">admin@velora.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('men.manager@velora.com', 'MenManager2026!')}
            className="p-2 bg-white border border-velora-border hover:border-black text-left font-medium transition-colors"
          >
            👔 <strong>Men’s Manager</strong>
            <span className="block text-[9px] text-neutral-400 truncate">men.manager@velora.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('women.manager@velora.com', 'WomenManager2026!')}
            className="p-2 bg-white border border-velora-border hover:border-black text-left font-medium transition-colors"
          >
            👗 <strong>Women’s Manager</strong>
            <span className="block text-[9px] text-neutral-400 truncate">women.manager@velora.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('customer@velora.com', 'Customer2026!')}
            className="p-2 bg-white border border-velora-border hover:border-black text-left font-medium transition-colors"
          >
            🛍️ <strong>Patron Customer</strong>
            <span className="block text-[9px] text-neutral-400 truncate">customer@velora.com</span>
          </button>
        </div>
      </div>
    </div>
  );
};
