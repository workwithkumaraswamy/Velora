import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { Coupon } from '../../types';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const CouponsManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('15');
  const [maxDiscount, setMaxDiscount] = useState('1500');
  const [minOrderValue, setMinOrderValue] = useState('2999');
  const [departmentId, setDepartmentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/coupons', {
        code,
        description,
        discountType,
        discountValue: Number(discountValue),
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        minOrderValue: Number(minOrderValue) || 0,
        departmentId: departmentId || null,
      });

      setIsModalOpen(false);
      setCode('');
      setDescription('');
      fetchCoupons();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create promo code');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter((c) => c.id !== id));
    } catch (err: any) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Campaigns & Incentives
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Promotional Coupons & Voucher Codes ({coupons.length} Active)
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((cp) => (
          <div key={cp.id} className="bg-white border border-velora-border p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-velora-black text-white">
                  {cp.code}
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5">
                  {cp.discountType === 'PERCENTAGE' ? `${cp.discountValue}% OFF` : `FLAT ${formatINR(cp.discountValue)} OFF`}
                </span>
              </div>

              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                {cp.description || 'Promotional seasonal offer.'}
              </p>

              <div className="space-y-1 text-xs text-neutral-500 font-light pt-2 border-t border-velora-border">
                <p>Min. Order Value: <strong>{formatINR(cp.minOrderValue)}</strong></p>
                {cp.maxDiscount && <p>Max. Discount Cap: <strong>{formatINR(cp.maxDiscount)}</strong></p>}
                <p>Valid Until: <strong>{formatDate(cp.expiryDate)}</strong></p>
              </div>
            </div>

            <div className="pt-3 border-t border-velora-border flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">Times Claimed: {cp.timesUsed || 0}</span>
              <button
                onClick={() => handleDelete(cp.id)}
                className="text-neutral-400 hover:text-rose-600 p-1"
                title="Delete coupon"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Coupon Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Promotional Voucher">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Voucher Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FESTIVE20"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black uppercase font-mono font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Description
            </label>
            <input
              type="text"
              placeholder="e.g. 20% off on all formalwear blazers"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED_AMOUNT">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                required
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Minimum Order Value (₹)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Max Discount Cap (₹)
              </label>
              <input
                type="number"
                placeholder="Optional cap"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black font-mono"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
            Save & Publish Voucher
          </Button>
        </form>
      </Modal>
    </div>
  );
};
