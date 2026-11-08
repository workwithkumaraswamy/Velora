import React, { useState, useEffect } from 'react';
import { Truck, Plus, Star, Phone, Mail, Globe, Clock, Edit2 } from 'lucide-react';
import { Supplier } from '../../types';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const SuppliersManager: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    leadTimeDays: 3,
    notes: '',
  });

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', formData);
      setIsModalOpen(false);
      setFormData({
        name: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        leadTimeDays: 3,
        notes: '',
      });
      fetchSuppliers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create supplier');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Fulfillment Partners
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Dropshipping Supplier Directory ({suppliers.length} Certified Partners)
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Supplier Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-white border border-velora-border p-6 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold bg-velora-beige text-velora-black">
                  {sup.code}
                </span>
                <div className="flex items-center space-x-1 text-xs text-amber-700 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{sup.rating}</span>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg text-velora-black font-normal">{sup.name}</h3>
                <p className="text-[11px] text-neutral-400 font-light mt-0.5">{sup.notes || 'Accredited warehouse partner'}</p>
              </div>

              <div className="space-y-1.5 text-xs text-neutral-600 font-light pt-2 border-t border-velora-border">
                <p className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{sup.contactEmail}</span>
                </p>
                {sup.contactPhone && (
                  <p className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{sup.contactPhone}</span>
                  </p>
                )}
                {sup.website && (
                  <p className="flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-neutral-400" />
                    <a href={sup.website} target="_blank" rel="noreferrer" className="text-velora-champagne-dark hover:underline truncate">
                      {sup.website}
                    </a>
                  </p>
                )}
                <p className="flex items-center space-x-2 pt-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Lead Time: <strong>{sup.leadTimeDays} business days</strong></span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-velora-border flex items-center justify-between text-xs text-neutral-500">
              <span>{sup.productsCount || 0} Products Mapped</span>
              <span className="text-emerald-700 font-medium">● Active Supplier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Supplier Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Dropshipping Supplier">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Supplier / Company Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Silk Heritage Crafts Varanasi"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Contact Person
              </label>
              <input
                type="text"
                placeholder="Manager Name"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Fulfillment Email *
              </label>
              <input
                type="email"
                required
                placeholder="orders@supplier.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Phone
              </label>
              <input
                type="tel"
                placeholder="+91..."
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Lead Time (Days)
              </label>
              <input
                type="number"
                min={1}
                value={formData.leadTimeDays}
                onChange={(e) => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Supplier Notes / Warehouse Location
            </label>
            <textarea
              rows={2}
              placeholder="Fulfillment terms, return hub address..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full">
            Save Supplier Partner
          </Button>
        </form>
      </Modal>
    </div>
  );
};
