import React, { useState, useEffect } from 'react';
import { Headphones, Send, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { SupportTicket } from '../../types';
import { api } from '../../services/api';
import { formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const SupportTicketsManager: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/admin/all');
      const data: SupportTicket[] = res.data.data || [];
      setTickets(data);
      if (data.length > 0 && !activeTicket) {
        setActiveTicket(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    setIsSending(true);
    try {
      const res = await api.post(`/support/${activeTicket.id}/messages`, {
        text: replyText.trim(),
      });
      const updated: SupportTicket = res.data.data;
      setActiveTicket(updated);
      setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
      setReplyText('');
    } catch (err: any) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleResolveTicket = async () => {
    if (!activeTicket) return;
    try {
      const res = await api.put(`/support/admin/${activeTicket.id}/status`, {
        status: 'RESOLVED',
      });
      const updated = res.data.data;
      setActiveTicket(updated);
      setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err: any) {
      alert('Failed to resolve ticket');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Client Relations
          </span>
          <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
            Concierge Support Desk & Patron Communications
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="bg-white border border-velora-border divide-y divide-velora-border max-h-[560px] overflow-y-auto">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">No support tickets found.</div>
          ) : (
            tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`w-full text-left p-4 transition-colors ${
                  activeTicket?.id === t.id ? 'bg-velora-beige/80 border-l-4 border-l-velora-champagne-dark' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-neutral-400">{t.ticketNumber}</span>
                  <span
                    className={`px-1.5 py-0.5 font-bold uppercase ${
                      t.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
                <h5 className="font-medium text-xs text-velora-black line-clamp-1 mt-1">{t.subject}</h5>
                <span className="text-[10px] text-neutral-400 mt-1 block">Dept: {t.department}</span>
              </button>
            ))
          )}
        </div>

        {/* Conversation View */}
        {activeTicket ? (
          <div className="md:col-span-2 bg-white border border-velora-border flex flex-col justify-between h-[560px]">
            {/* Header */}
            <div className="p-4 border-b border-velora-border bg-velora-ivory/50 flex items-center justify-between">
              <div>
                <h4 className="font-serif text-base text-velora-black font-normal">{activeTicket.subject}</h4>
                <p className="text-[10px] text-neutral-500 font-mono">Ref: {activeTicket.ticketNumber} • Dept: {activeTicket.department}</p>
              </div>

              {activeTicket.status !== 'RESOLVED' && (
                <Button variant="outline" size="sm" onClick={handleResolveTicket} leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Mark Resolved
                </Button>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeTicket.messages?.map((m) => (
                <div key={m.id} className={`flex flex-col ${m.sender === 'agent' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-md p-3 text-xs leading-relaxed ${
                      m.sender === 'agent'
                        ? 'bg-velora-black text-white'
                        : 'bg-velora-beige text-velora-black border border-velora-border'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-widest block font-semibold mb-1 opacity-70">
                      {m.senderName || (m.sender === 'agent' ? 'VÉLORA Concierge Advisor' : 'Patron Client')}
                    </span>
                    <p className="font-light">{m.text}</p>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono mt-0.5 px-1">{formatDateTime(m.sentAt)}</span>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="p-3 border-t border-velora-border bg-velora-cream flex space-x-2">
              <input
                type="text"
                placeholder="Reply to client as VÉLORA Concierge..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-white border border-velora-border py-2 px-3 text-xs text-velora-black focus:outline-none"
              />
              <Button type="submit" variant="primary" size="sm" isLoading={isSending} rightIcon={<Send className="w-3.5 h-3.5" />}>
                Send Reply
              </Button>
            </form>
          </div>
        ) : (
          <div className="md:col-span-2 bg-white border border-velora-border flex items-center justify-center text-xs text-neutral-400">
            Select a ticket from the list to view dialogue.
          </div>
        )}
      </div>
    </div>
  );
};
