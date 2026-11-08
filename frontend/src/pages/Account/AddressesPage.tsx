import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Home, Briefcase } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const AddressesPage: React.FC = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      fullName: 'Rohan Verma',
      phone: '+919812345678',
      houseNumber: 'Villa 14',
      street: 'Magnolia Boulevard',
      area: 'Golf Course Road, DLF Phase 5',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      landmark: 'Near DLF Horizon Club',
      addressType: 'Home',
      isDefault: true,
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    houseNumber: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddresses([
      ...addresses,
      {
        ...newAddr,
        id: `addr-${Date.now()}`,
        isDefault: addresses.length === 0,
      }
    ]);
    setIsAdding(false);
    setNewAddr({
      fullName: '',
      phone: '',
      houseNumber: '',
      street: '',
      area: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      addressType: 'Home',
    });
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-velora-border">
        <div>
          <h3 className="font-serif text-xl text-velora-black font-normal">
            Saved Shipping Addresses
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Manage your residences and offices for express checkout.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Add New Address
        </Button>
      </div>

      {/* Add Address Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-white border border-velora-border p-6 space-y-4 text-xs">
          <h4 className="font-serif text-base text-velora-black font-normal">Enter Destination Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Recipient Name *
              </label>
              <input
                type="text"
                required
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                House / Villa # *
              </label>
              <input
                type="text"
                required
                value={newAddr.houseNumber}
                onChange={(e) => setNewAddr({ ...newAddr, houseNumber: e.target.value })}
                className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Street *
              </label>
              <input
                type="text"
                required
                value={newAddr.street}
                onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Address
            </Button>
          </div>
        </form>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((a) => (
          <div key={a.id} className="bg-white border border-velora-border p-5 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-velora-beige text-velora-black">
                {a.addressType === 'Home' ? <Home className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                <span>{a.addressType}</span>
              </span>

              {a.isDefault && (
                <span className="text-[10px] text-velora-champagne-dark uppercase font-semibold">
                  Default Delivery Address
                </span>
              )}
            </div>

            <div className="text-xs text-neutral-700 space-y-0.5 font-light">
              <p className="font-semibold text-velora-black">{a.fullName}</p>
              <p>{a.houseNumber}, {a.street}</p>
              <p>{a.area}</p>
              <p>{a.city}, {a.state} — {a.pincode}</p>
              <p className="text-neutral-500 pt-1">Phone: {a.phone}</p>
            </div>

            <div className="pt-2 border-t border-velora-border flex justify-end">
              <button
                onClick={() => handleDelete(a.id)}
                className="text-xs text-neutral-400 hover:text-rose-600 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
