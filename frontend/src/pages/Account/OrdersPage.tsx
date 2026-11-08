import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ExternalLink } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { formatINR, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-xs text-neutral-500">Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white border border-velora-border p-12 text-center space-y-3">
        <Package className="w-10 h-10 text-neutral-400 mx-auto stroke-[1.5]" />
        <h3 className="font-serif text-xl text-velora-black">No Orders Placed Yet</h3>
        <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
          You haven't commissioned any sartorial pieces yet. Explore our premier curation.
        </p>
        <div className="pt-2">
          <Link to="/men">
            <Button variant="primary" size="md">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-velora-border divide-y divide-velora-border shadow-sm">
          {/* Order Header */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-velora-ivory/40">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
                Order ID
              </span>
              <h4 className="font-mono text-sm font-bold text-velora-black">
                {order.orderNumber}
              </h4>
              <span className="text-[11px] text-neutral-500 font-light">
                {formatDateTime(order.placedAt)}
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-velora-black text-white">
                {order.status.replace(/_/g, ' ')}
              </span>
              <Link to={`/track-order?orderId=${order.orderNumber}`}>
                <Button variant="outline" size="sm" leftIcon={<Truck className="w-3.5 h-3.5" />}>
                  Track
                </Button>
              </Link>
            </div>
          </div>

          {/* Items */}
          <div className="p-5 divide-y divide-velora-border space-y-3">
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
                    <p className="text-[11px] text-neutral-500 font-light">
                      {it.color} • Size: {it.size} • Qty: {it.quantity}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-velora-black font-sans">{formatINR(it.subtotal)}</span>
              </div>
            ))}
          </div>

          {/* Footer Total */}
          <div className="p-4 bg-velora-ivory/20 flex justify-between items-center text-xs">
            <span className="text-neutral-500">
              Payment Method: <strong className="text-velora-black font-semibold">{order.paymentMethod}</strong>
            </span>
            <div className="text-right">
              <span className="text-neutral-500 mr-2">Total Amount:</span>
              <span className="font-semibold text-sm text-velora-black font-sans">{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
