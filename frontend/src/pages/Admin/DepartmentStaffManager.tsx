import React, { useState, useEffect } from 'react';
import { Users, Plus, ShieldCheck, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { User, Role } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const DepartmentStaffManager: React.FC = () => {
  const [staff, setStaff] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'MENS_MANAGER' as Role,
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await api.get('/users/staff');
      setStaff(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/users/staff', formData);
      setIsModalOpen(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'MENS_MANAGER',
        password: '',
      });
      fetchStaff();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create manager account');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleDescriptions: Record<string, string> = {
    SUPER_ADMIN: 'Complete business authority across all departments, finances, catalog and staff.',
    MENS_MANAGER: 'Autonomous control over Men’s sartorial catalog, sizing variants, inventory & department promotions.',
    WOMENS_MANAGER: 'Autonomous control over Women’s haute apparel, silks, footwear, jewellery & promotions.',
    KIDS_MANAGER: 'Autonomous control over Kids’ clothing, festive sets, lifestyle accessories & promotions.',
    ORDER_MANAGER: 'Logistics fulfillment, dropshipping supplier dispatches, waybills & courier sync.',
    SUPPORT_MANAGER: 'Patron inquiries, returns inspection, size exchanges & refund approvals.',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Enterprise Governance (RBAC)
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Department Managers & Administrative Staff ({staff.length} Appointed)
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Appoint Department Manager
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white border border-velora-border p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                  {member.role.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold uppercase">● Active</span>
              </div>

              <div>
                <h3 className="font-serif text-lg text-velora-black font-normal">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-[11px] text-neutral-500 font-light mt-1">
                  {roleDescriptions[member.role] || 'Department Staff'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 font-light pt-2 border-t border-velora-border">
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{member.email}</span>
                </p>
                {member.phone && (
                  <p className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{member.phone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-velora-border text-[10px] text-neutral-400 font-mono">
              Role Authority: Strictly Enforced
            </div>
          </div>
        ))}
      </div>

      {/* Appoint Manager Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Appoint Department Manager">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="manager@velora.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Department Role & Permissions *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
            >
              <option value="MENS_MANAGER">Men’s Department Manager</option>
              <option value="WOMENS_MANAGER">Women’s Department Manager</option>
              <option value="KIDS_MANAGER">Kids’ Department Manager</option>
              <option value="ORDER_MANAGER">Dropshipping & Order Manager</option>
              <option value="SUPPORT_MANAGER">Client Support & Returns Manager</option>
              <option value="SUPER_ADMIN">Super Administrator (Universal Access)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Temporary Password *
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
            />
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
            Create Appointed Account
          </Button>
        </form>
      </Modal>
    </div>
  );
};
