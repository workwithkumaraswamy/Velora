import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { formatINR, formatDate } from '../utils/formatters';
import { Button } from '../components/common/Button';

export const OrderSuccessPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/track/${orderNumber}`);
        setOrder(res.data.data);
      } catch (err) {
        console.error('Error fetching confirmed order:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Success Badge & Headline */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-600 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
          Order Confirmed & Logged
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-velora-black font-normal">
          Thank You For Shopping With VÉLORA
        </h1>

        <p className="text-xs sm:text-sm text-neutral-600 font-light max-w-md mx-auto leading-relaxed">
          Your sartorial commission has been confirmed. A formal receipt and shipment dispatch tracking details have been dispatched to your email address.
        </p>

        <div className="inline-block p-3 bg-velora-ivory border border-velora-border font-mono text-xs text-velora-black">
          Order Reference: <strong className="font-bold tracking-wider">{orderNumber}</strong>
        </div>
      </div>

      {/* Order Status & Key Highlights */}
      {order && (
        <div className="bg-white border border-velora-border divide-y divide-velora-border">
          {/* Dispatch Notice */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Payment Status
              </span>
              <span className="font-semibold text-emerald-800 text-sm mt-0.5 inline-block">
                {order.paymentMethod === 'COD' ? 'Cash on Delivery (Pending)' : 'Paid Online (Verified)'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Estimated Delivery
              </span>
              <span className="font-semibold text-velora-black text-sm mt-0.5 inline-block">
                {order.shipment?.estimatedDelivery ? formatDate(order.shipment.estimatedDelivery) : '3-4 Business Days'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-semibold">
                Fulfillment Partner
              </span>
              <span className="font-semibold text-velora-black text-sm mt-0.5 inline-block">
                {order.shipment?.courierName || 'BlueDart Express Air'}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-6 text-xs text-neutral-700 space-y-1">
            <h4 className="font-semibold uppercase tracking-wider text-velora-black text-[11px]">
              Delivery Destination
            </h4>
            <p className="font-medium">{order.shippingAddressSnapshot.fullName}</p>
            <p className="font-light text-neutral-500">
              {order.shippingAddressSnapshot.houseNumber}, {order.shippingAddressSnapshot.street}, {order.shippingAddressSnapshot.area}, {order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.state} — {order.shippingAddressSnapshot.pincode}
            </p>
            <p className="font-light text-neutral-500">Phone: {order.shippingAddressSnapshot.phone}</p>
          </div>

          {/* Purchased Line Items */}
          <div className="p-6 space-y-4">
            <h4 className="font-semibold uppercase tracking-wider text-velora-black text-[11px]">
              Commissioned Creations
            </h4>
            <div className="divide-y divide-velora-border space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    {it.imageUrl && (
                      <img
                        src={it.imageUrl}
                        alt={it.title}
                        className="w-12 h-16 object-cover border border-velora-border flex-shrink-0"
                      />
                    )}
                    <div>
                      <h5 className="font-serif text-sm text-velora-black">{it.title}</h5>
                      <p className="text-[11px] text-neutral-500">
                        {it.color} • Size: {it.size} • Qty: {it.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-velora-black font-sans">{formatINR(it.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Total amount summary */}
            <div className="pt-4 border-t border-velora-border flex justify-between items-center text-sm font-semibold text-velora-black">
              <span>Total Payable</span>
              <span className="font-serif text-lg">{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to={`/track-order?orderId=${orderNumber}`}>
          <Button variant="primary" size="lg" className="w-full sm:w-auto tracking-widest" leftIcon={<Truck className="w-4 h-4" />}>
            Track Shipment Progress
          </Button>
        </Link>
        <Link to="/men">
          <Button variant="outline" size="lg" className="w-full sm:w-auto tracking-widest">
            Continue Exploring
          </Button>
        </Link>
      </div>
    </div>
  );
};
