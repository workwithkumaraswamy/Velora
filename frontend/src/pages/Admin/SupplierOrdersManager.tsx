import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle2, Clock, Send, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const SupplierOrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/suppliers/orders');
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await api.put(`/suppliers/orders/${selectedOrder.id}`, {
        status: newStatus,
        courierName: courierName || undefined,
        trackingNumber: trackingNumber || undefined,
      });

      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update supplier order');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Dropshipping Fulfillment
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Supplier Purchase Orders ({orders.length} Dispatches)
          </h1>
        </div>
      </div>

      <div className="bg-white border border-velora-border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-velora-border">
          <thead className="bg-velora-ivory/60 text-neutral-500 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Purchase Order ID</th>
              <th className="py-3 px-4">Customer Order Ref</th>
              <th className="py-3 px-4">Supplier Partner</th>
              <th className="py-3 px-4">Fulfillment Cost</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Logistics / Tracking</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-velora-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">
                  No supplier orders generated yet. Supplier orders are created automatically when customers checkout.
                </td>
              </tr>
            ) : (
              orders.map((so) => (
                <tr key={so.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-mono font-bold text-velora-black">
                    {so.id}
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-velora-champagne-dark">
                    {so.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-neutral-800">
                    {so.supplierName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-velora-black font-sans">
                    {formatINR(so.totalCost)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                        so.status === 'CONFIRMED'
                          ? 'bg-blue-100 text-blue-800'
                          : so.status === 'SHIPPED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {so.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                    {so.trackingNumber ? (
                      <div>
                        <span>{so.courierName}</span>
                        <span className="block text-neutral-400">{so.trackingNumber}</span>
                      </div>
                    ) : (
                      <span className="text-neutral-400 italic">Not Dispatched</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(so);
                        setNewStatus(so.status === 'REQUESTED' ? 'CONFIRMED' : 'SHIPPED');
                      }}
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Update Supplier Order (${selectedOrder.id})`}
        >
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Fulfillment Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              >
                <option value="REQUESTED">REQUESTED (Awaiting Supplier Acknowledgment)</option>
                <option value="CONFIRMED">CONFIRMED (Supplier Processing Order)</option>
                <option value="SHIPPED">SHIPPED (Handed over to courier)</option>
                <option value="DELIVERED">DELIVERED (Customer Receipt Confirmed)</option>
              </select>
            </div>

            {newStatus === 'SHIPPED' && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                    Courier Partner
                  </label>
                  <input
                    type="text"
                    required
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                    Waybill / Tracking Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BD982736412IN"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none font-mono"
                  />
                </div>
              </>
            )}

            <Button type="submit" variant="primary" size="md" isLoading={isUpdating} className="w-full">
              Save Fulfillment Update
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
