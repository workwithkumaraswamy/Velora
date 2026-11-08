import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Truck, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const OrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  // Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/orders/admin/all');
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

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await api.put(`/orders/admin/${selectedOrder.id}/status`, {
        status: newStatus,
        trackingDetails: {
          courierName,
          trackingNumber: trackingNumber || undefined,
        },
      });

      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update order');
    } finally {
      setIsUpdating(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Fulfillment & Commerce
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Customer Orders Administration ({orders.length} Total)
          </h1>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-velora-border p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order ID or Patron..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-50 border border-velora-border py-2 pl-9 pr-3 text-xs text-velora-black focus:outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs uppercase tracking-wider text-neutral-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-velora-border py-2 px-3 text-xs uppercase text-velora-black focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="RETURN_REQUESTED">RETURN REQUESTED</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-velora-border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-velora-border">
          <thead className="bg-velora-ivory/60 text-neutral-500 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Patron Details</th>
              <th className="py-3 px-4">Date & Items</th>
              <th className="py-3 px-4">Amount / Payment</th>
              <th className="py-3 px-4">Fulfillment Status</th>
              <th className="py-3 px-4">Shipment Tracking</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-velora-border">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-neutral-50">
                <td className="py-3 px-4 font-mono font-bold text-velora-black">
                  {order.orderNumber}
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-velora-black block">
                    {order.user?.firstName} {order.user?.lastName}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-light">{order.user?.email}</span>
                </td>
                <td className="py-3 px-4 text-neutral-600">
                  <span className="block text-[11px] font-mono">{formatDateTime(order.placedAt)}</span>
                  <span className="text-[10px] text-neutral-400">{order.items.length} items</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-velora-black block font-sans">{formatINR(order.totalAmount)}</span>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                    {order.paymentMethod} • {order.paymentStatus}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">
                  {order.shipment?.trackingNumber ? (
                    <div>
                      <span>{order.shipment.courierName}</span>
                      <span className="block text-velora-champagne-dark font-semibold">
                        {order.shipment.trackingNumber}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic">No Tracking</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewStatus(order.status);
                      setCourierName(order.shipment?.courierName || 'BlueDart Express');
                      setTrackingNumber(order.shipment?.trackingNumber || '');
                    }}
                  >
                    Manage
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order Management — ${selectedOrder.orderNumber}`}
          maxWidth="lg"
        >
          <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Update Fulfillment Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as any)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              >
                <option value="CONFIRMED">CONFIRMED (Order Verified)</option>
                <option value="PROCESSING">PROCESSING (Packaging in Progress)</option>
                <option value="SHIPPED">SHIPPED (Handed to Courier Partner)</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY (Last-Mile Dispatch)</option>
                <option value="DELIVERED">DELIVERED (Successful Doorstep Handover)</option>
                <option value="CANCELLED">CANCELLED (Order Voided)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Waybill / Tracking ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. BD99281726IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-velora-ivory border border-velora-border space-y-1 text-neutral-600">
              <span className="font-semibold text-velora-black block">Recipient Destination:</span>
              <p>
                {selectedOrder.shippingAddressSnapshot.fullName} • {selectedOrder.shippingAddressSnapshot.phone}
              </p>
              <p className="font-light">
                {selectedOrder.shippingAddressSnapshot.houseNumber}, {selectedOrder.shippingAddressSnapshot.street}, {selectedOrder.shippingAddressSnapshot.area}, {selectedOrder.shippingAddressSnapshot.city} — {selectedOrder.shippingAddressSnapshot.pincode}
              </p>
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={isUpdating} className="w-full">
              Save Order Status & Notify Patron
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
};
