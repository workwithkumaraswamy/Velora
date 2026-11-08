import React, { useState, useEffect } from 'react';
import { RotateCcw, CheckCircle2, XCircle, DollarSign, Clock } from 'lucide-react';
import { ReturnRequest } from '../../types';
import { api } from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const ReturnsManager: React.FC = () => {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/returns/admin/all');
      setReturns(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/returns/admin/${id}`, {
        status,
        adminNotes: `Status changed to ${status} by admin console.`,
      });
      fetchReturns();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update return request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Concierge Resolution
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Return Requests & Doorstep Refunds ({returns.length} Total)
          </h1>
        </div>
      </div>

      <div className="bg-white border border-velora-border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-velora-border">
          <thead className="bg-velora-ivory/60 text-neutral-500 uppercase text-[10px] tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4">Request ID</th>
              <th className="py-3 px-4">Order Reference</th>
              <th className="py-3 px-4">Reason & Explanation</th>
              <th className="py-3 px-4">Refund Amount</th>
              <th className="py-3 px-4">Bank / UPI Details</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-velora-border">
            {returns.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-400">
                  No return requests logged.
                </td>
              </tr>
            ) : (
              returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-mono font-bold text-velora-black">{ret.id}</td>
                  <td className="py-3 px-4 font-mono text-velora-champagne-dark">{ret.orderNumber || ret.orderId}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-velora-black block">{ret.reason.replace(/_/g, ' ')}</span>
                    <span className="text-neutral-500 text-[11px] font-light">{ret.detailedReason || 'No notes'}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-velora-black font-sans">{formatINR(ret.refundAmount)}</td>
                  <td className="py-3 px-4 font-mono text-[11px] text-neutral-600">{ret.bankDetails || 'Original Method'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        ret.status === 'APPROVED' || ret.status === 'REFUND_ISSUED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ret.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ret.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {ret.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(ret.id, 'APPROVED')}
                          className="px-2.5 py-1 bg-emerald-700 text-white text-[10px] font-semibold uppercase hover:bg-emerald-800"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(ret.id, 'REJECTED')}
                          className="px-2.5 py-1 bg-rose-700 text-white text-[10px] font-semibold uppercase hover:bg-rose-800"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {ret.status === 'APPROVED' && (
                      <button
                        onClick={() => handleUpdateStatus(ret.id, 'REFUND_ISSUED')}
                        className="px-2.5 py-1 bg-velora-black text-white text-[10px] font-semibold uppercase hover:bg-neutral-800"
                      >
                        Issue Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
