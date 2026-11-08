import React, { useState, useEffect } from 'react';
import { RotateCcw, AlertCircle, Plus, CheckCircle2 } from 'lucide-react';
import { ReturnRequest, Order } from '../../types';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const ReturnsPage: React.FC = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [reason, setReason] = useState('SIZE_DOES_NOT_FIT');
  const [detailedReason, setDetailedReason] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const fetchReturns = async () => {
    try {
      const [retRes, ordRes] = await Promise.all([
        api.get('/returns/my-returns'),
        api.get('/orders/my-orders'),
      ]);
      setReturns(retRes.data.data || []);
      setOrders(ordRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId) {
      alert('Please select an order to return');
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('/returns', {
        orderId: selectedOrderId,
        reason,
        detailedReason,
        bankDetails,
      });
      setSuccessMsg(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg(false);
        fetchReturns();
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to submit return request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-velora-border">
        <div>
          <h3 className="font-serif text-xl text-velora-black font-normal">
            Returns & Concierge Exchanges
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Doorstep pickup, size replacement, and instant refund processing.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Request Return
        </Button>
      </div>

      {returns.length === 0 ? (
        <div className="bg-white border border-velora-border p-12 text-center space-y-3">
          <RotateCcw className="w-10 h-10 text-neutral-400 mx-auto stroke-[1.5]" />
          <h4 className="font-serif text-lg text-velora-black">No Active Return Requests</h4>
          <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
            All orders placed within the last 7 days are eligible for complimentary concierge exchange or refund.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {returns.map((ret) => (
            <div key={ret.id} className="bg-white border border-velora-border p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-neutral-400 font-semibold block">Order Reference</span>
                  <span className="font-mono font-bold text-velora-black">{ret.orderId}</span>
                </div>
                <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-velora-champagne-light text-velora-champagne-dark">
                  {ret.status}
                </span>
              </div>

              <div className="space-y-1 text-neutral-700 font-light">
                <p><strong>Reason:</strong> {ret.reason.replace(/_/g, ' ')}</p>
                {ret.detailedReason && <p><strong>Notes:</strong> {ret.detailedReason}</p>}
                <p><strong>Refund Amount:</strong> {formatINR(ret.refundAmount)}</p>
                <p className="text-[11px] text-neutral-400">Requested on {formatDate(ret.requestedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Request Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initiate Return / Exchange">
        {successMsg ? (
          <div className="text-center py-6 text-emerald-700 space-y-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
            <h4 className="font-serif text-lg">Return Request Submitted</h4>
            <p className="text-xs">Our concierge will review and schedule your complimentary courier pickup within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Select Order *
              </label>
              <select
                required
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              >
                <option value="">-- Choose an order --</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.orderNumber} ({formatINR(o.totalAmount)}) — {o.status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Reason for Return / Exchange *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              >
                <option value="SIZE_DOES_NOT_FIT">Size Does Not Fit (Exchange Needed)</option>
                <option value="QUALITY_NOT_AS_EXPECTED">Fabric / Finishing Evaluation</option>
                <option value="DEFECTIVE_OR_DAMAGED">Defect or Courier Damage</option>
                <option value="NOT_AS_DESCRIBED">Item Differed from Description</option>
                <option value="ORDERED_WRONG_ITEM">Ordered Inadvertently</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Details & Replacement Size
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Please send size 42 instead of 40 for the blazer..."
                value={detailedReason}
                onChange={(e) => setDetailedReason(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                UPI ID or Bank Details (For COD orders)
              </label>
              <input
                type="text"
                placeholder="name@okaxis or Bank Account & IFSC"
                value={bankDetails}
                onChange={(e) => setBankDetails(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
              Confirm Return Request
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
