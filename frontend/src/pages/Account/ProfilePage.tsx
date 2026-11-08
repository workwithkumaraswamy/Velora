import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);
    try {
      await updateProfile({ firstName, lastName, phone });
      setMsg('Profile details updated successfully.');
    } catch {
      setMsg('Unable to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-velora-border p-8 space-y-6">
      <div>
        <h3 className="font-serif text-xl text-velora-black font-normal">
          Personal Information
        </h3>
        <p className="text-xs text-neutral-500 font-light mt-0.5">
          Update your contact information for order confirmations and receipts.
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4 max-w-lg text-xs">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full bg-neutral-100 border border-neutral-200 p-2.5 text-xs text-neutral-500 cursor-not-allowed"
          />
          <span className="text-[10px] text-neutral-400 mt-0.5 block">Email cannot be changed directly for security.</span>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91..."
            className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne"
          />
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" size="md" isLoading={isSaving} className="tracking-widest">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
