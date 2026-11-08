import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-velora-champagne-dark">
          Patron Registry
        </span>
        <h1 className="font-serif text-3xl text-velora-black font-normal">
          Create A VÉLORA Account
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Enjoy bespoke order tracking, saved measurement sizing and private invitations.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-velora-border p-8 space-y-5 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
              First Name *
            </label>
            <input
              type="text"
              required
              placeholder="Aarav"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-white border border-velora-border py-2.5 px-3 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
              Last Name *
            </label>
            <input
              type="text"
              required
              placeholder="Mehta"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-white border border-velora-border py-2.5 px-3 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="aarav@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-velora-border py-2.5 pl-3 pr-9 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
            Mobile Number (Optional)
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-white border border-velora-border py-2.5 pl-3 pr-9 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
            <Phone className="w-4 h-4 text-neutral-400 absolute right-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white border border-velora-border py-2.5 px-3 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-white border border-velora-border py-2.5 px-3 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
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
          Complete Registration
        </Button>

        <p className="text-center text-xs text-neutral-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="text-velora-black font-semibold uppercase tracking-wider hover:underline">
            Sign In Here
          </Link>
        </p>
      </form>
    </div>
  );
};
