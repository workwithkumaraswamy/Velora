import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { formatINR, formatDate, formatDateTime } from '../utils/formatters';
import { Button } from '../components/common/Button';

export const TrackOrderPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get(`/orders/track/${id.trim()}`);
      setOrder(res.data.data);
      setSearchParams({ orderId: id.trim() });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Order not found. Please verify your reference number.');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTracking(initialOrderId);
    }
  }, [initialOrderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(orderIdInput);
  };

  // Determine timeline progress
  const getStepStatus = (currentStatus?: OrderStatus) => {
    const sequence: OrderStatus[] = [
      'CONFIRMED',
      'PROCESSING',
      'SUPPLIER_REQUESTED',
      'PACKED',
      'SHIPPED',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ];
    if (!currentStatus) return 0;
    const index = sequence.indexOf(currentStatus);
    return index > -1 ? index : 1;
  };

  const currentStep = getStepStatus(order?.status);

  const timelineSteps = [
    { title: 'Order Confirmed', desc: 'Order verified and authorized in system.' },
    { title: 'Atelier Processing', desc: 'Garment reserved & inspected at warehouse.' },
    { title: 'Dispatched to Courier', desc: 'Handed over to express air delivery.' },
    { title: 'Out for Delivery', desc: 'Courier agent on route to your doorstep.' },
    { title: 'Delivered', desc: 'Parcel safely received with signature.' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Title & Lookup Form */}
      <div className="text-center space-y-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
          Real-Time Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-velora-black font-normal">
          Track Your Sartorial Order
        </h1>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
          Enter your order reference number (e.g. VEL-2026-89412) to monitor live courier progress.
        </p>

        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-4 flex">
          <input
            type="text"
            placeholder="e.g. VEL-2026-89412"
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            className="flex-1 bg-white border border-velora-border border-r-0 py-3 px-4 text-xs font-mono uppercase tracking-wider text-velora-black placeholder-neutral-400 focus:outline-none focus:border-velora-champagne"
          />
          <Button type="submit" variant="primary" size="md" isLoading={isLoading} className="border-l-0">
            Track
          </Button>
        </form>

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 max-w-md mx-auto mt-3">
            {error}
          </p>
        )}
      </div>

      {/* Tracking Results */}
      {order && (
        <div className="bg-white border border-velora-border divide-y divide-velora-border shadow-sm">
          {/* Header Bar */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-velora-ivory/50">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Order Reference
              </span>
              <h3 className="font-mono text-base font-bold text-velora-black">
                {order.orderNumber}
              </h3>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Placed on {formatDateTime(order.placedAt)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Current Status
              </span>
              <span className="inline-block mt-0.5 px-3 py-1 text-xs uppercase tracking-wider font-semibold bg-velora-black text-white">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Courier & Waybill Information */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Courier Partner
              </span>
              <p className="font-semibold text-velora-black text-sm mt-0.5">
                {order.shipment?.courierName || 'BlueDart Express Air'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Tracking Waybill #
              </span>
              <p className="font-mono font-semibold text-velora-champagne-dark text-sm mt-0.5">
                {order.shipment?.trackingNumber || 'Pending Allocation'}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Estimated Arrival
              </span>
              <p className="font-semibold text-velora-black text-sm mt-0.5">
                {order.shipment?.estimatedDelivery ? formatDate(order.shipment.estimatedDelivery) : 'In 3-4 Business Days'}
              </p>
            </div>
          </div>

          {/* Graphical Step Timeline */}
          <div className="p-6 sm:p-8 space-y-6">
            <h4 className="font-serif text-lg text-velora-black font-normal">
              Logistics Progression
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-velora-border">
              {timelineSteps.map((s, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={idx} className="relative flex items-start space-x-4">
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isPassed
                          ? 'bg-velora-black text-velora-champagne border-velora-black'
                          : 'bg-white text-neutral-300 border-neutral-300'
                      }`}
                    >
                      {isPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h5
                        className={`text-xs uppercase tracking-wider font-semibold ${
                          isCurrent
                            ? 'text-velora-champagne-dark'
                            : isPassed
                            ? 'text-velora-black'
                            : 'text-neutral-400'
                        }`}
                      >
                        {s.title}
                      </h5>
                      <p className="text-xs text-neutral-500 font-light">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Destination */}
          <div className="p-6 text-xs text-neutral-600 bg-velora-ivory/30 space-y-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-velora-black block">
              Destination Address
            </span>
            <p className="font-medium text-velora-black">{order.shippingAddressSnapshot.fullName}</p>
            <p className="font-light">
              {order.shippingAddressSnapshot.houseNumber}, {order.shippingAddressSnapshot.street}, {order.shippingAddressSnapshot.area}, {order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.state} — {order.shippingAddressSnapshot.pincode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
