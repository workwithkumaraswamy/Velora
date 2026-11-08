import React, { useState, useEffect } from 'react';
import { Headphones, Plus, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { SupportTicket } from '../../types';
import { api } from '../../services/api';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // New ticket form
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('Orders');
  const [initialMessage, setInitialMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/my-tickets');
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !initialMessage.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await api.post('/support', {
        subject,
        department,
        initialMessage,
      });
      const newTck: SupportTicket = res.data.data;
      setTickets([newTck, ...tickets]);
      setActiveTicket(newTck);
      setIsNewOpen(false);
      setSubject('');
      setInitialMessage('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to open ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;
    setIsSendingReply(true);
    try {
      const res = await api.post(`/support/${activeTicket.id}/messages`, {
        text: replyText.trim(),
      });
      const updated: SupportTicket = res.data.data;
      setActiveTicket(updated);
      setTickets(tickets.map((t) => (t.id === updated.id ? updated : t)));
      setReplyText('');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to send message');
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-velora-border">
        <div>
          <h3 className="font-serif text-xl text-velora-black font-normal">
            Concierge Support Desk
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Direct communication channel with VÉLORA senior client advisors.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Open New Query
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white border border-velora-border p-12 text-center space-y-3">
          <Headphones className="w-10 h-10 text-neutral-400 mx-auto stroke-[1.5]" />
          <h4 className="font-serif text-lg text-velora-black">No Open Inquiries</h4>
          <p className="text-xs text-neutral-500 font-light max-w-sm mx-auto">
            Need styling advice, delivery assistance or custom fitting? Our concierge team responds within 2 business hours.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ticket List Column */}
          <div className="space-y-2 border border-velora-border bg-white divide-y divide-velora-border max-h-[500px] overflow-y-auto">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`w-full text-left p-4 transition-colors ${
                  activeTicket?.id === t.id ? 'bg-velora-beige/80 border-l-4 border-l-velora-champagne-dark' : 'hover:bg-velora-ivory'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                  <span>{t.ticketNumber}</span>
                  <span className="uppercase text-velora-black font-semibold">{t.status}</span>
                </div>
                <h5 className="font-medium text-xs text-velora-black line-clamp-1 mt-1">{t.subject}</h5>
                <span className="text-[10px] text-neutral-400 block mt-1">{formatDate(t.createdAt)}</span>
              </button>
            ))}
          </div>

          {/* Active Conversation Panel */}
          {activeTicket && (
            <div className="md:col-span-2 bg-white border border-velora-border flex flex-col justify-between h-[500px]">
              {/* Header */}
              <div className="p-4 border-b border-velora-border bg-velora-ivory/50 flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base text-velora-black font-normal">{activeTicket.subject}</h4>
                  <span className="text-[10px] text-neutral-500 font-mono">Ref: {activeTicket.ticketNumber} • Dept: {activeTicket.department}</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-velora-black text-white">
                  {activeTicket.status}
                </span>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeTicket.messages?.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-md p-3 text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-velora-black text-white'
                          : 'bg-velora-beige text-velora-black border border-velora-border'
                      }`}
                    >
                      <span className="text-[9px] uppercase tracking-widest block font-semibold mb-1 opacity-70">
                        {m.senderName || (m.sender === 'user' ? 'You' : 'VÉLORA Concierge')}
                      </span>
                      <p className="font-light">{m.text}</p>
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono mt-0.5 px-1">
                      {formatDateTime(m.sentAt)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-velora-border bg-velora-cream flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your message to concierge..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-white border border-velora-border py-2 px-3 text-xs text-velora-black focus:outline-none"
                />
                <Button type="submit" variant="primary" size="sm" isLoading={isSendingReply} rightIcon={<Send className="w-3 h-3" />}>
                  Send
                </Button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* New Ticket Modal */}
      <Modal isOpen={isNewOpen} onClose={() => setIsNewOpen(false)} title="Open Concierge Query">
        <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
            >
              <option value="Orders">Orders & Delivery</option>
              <option value="Sizing">Sizing & Tailoring Consultation</option>
              <option value="Returns">Returns & Refunds</option>
              <option value="General">General Inquiry</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sizing inquiry regarding Savile wool blazer"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Message Details
            </label>
            <textarea
              rows={4}
              required
              placeholder="Please provide full details of your query..."
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" size="md" isLoading={isSubmitting} className="w-full">
            Submit Query
          </Button>
        </form>
      </Modal>
    </div>
  );
};
