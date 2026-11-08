import { Router, Request, Response } from 'express';
import { store } from '../../utils/store';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticateToken, requireRoles } from '../../middleware/auth';
import { AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

// Customer creates ticket
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { subject, department, priority, initialMessage, orderId } = req.body;
  if (!subject || !initialMessage) {
    return sendError(res, 'Subject and initial message are required', 400);
  }

  const user = store.users.find(u => u.id === req.user?.userId);

  const ticketNumber = `TCK-${Math.floor(10000 + Math.random() * 90000)}`;
  const newTicket = {
    id: `tck-${Date.now()}`,
    ticketNumber,
    userId: req.user?.userId,
    orderId: orderId || null,
    subject,
    department: department || 'General',
    priority: priority || 'MEDIUM',
    status: 'OPEN',
    messages: [
      {
        id: `msg-${Date.now()}`,
        sender: 'user',
        senderName: `${user?.firstName} ${user?.lastName}`,
        text: initialMessage,
        sentAt: new Date().toISOString()
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.supportTickets.unshift(newTicket);
  return sendSuccess(res, newTicket, 'Support ticket opened successfully', 201);
});

// Customer gets their tickets
router.get('/my-tickets', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const tickets = store.supportTickets.filter(t => t.userId === req.user?.userId);
  return sendSuccess(res, tickets, 'My support tickets');
});

// Add message to ticket (user or agent)
router.post('/:id/messages', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const ticket = store.supportTickets.find(t => t.id === req.params.id);
  if (!ticket) return sendError(res, 'Ticket not found', 404);

  const { text } = req.body;
  if (!text) return sendError(res, 'Message text required', 400);

  const isStaff = req.user?.role !== 'CUSTOMER';
  const user = store.users.find(u => u.id === req.user?.userId);

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender: isStaff ? 'agent' : 'user',
    senderName: isStaff ? 'VÉLORA Concierge' : `${user?.firstName} ${user?.lastName}`,
    text,
    sentAt: new Date().toISOString()
  };

  ticket.messages.push(newMsg);
  ticket.updatedAt = new Date().toISOString();
  if (isStaff && ticket.status === 'OPEN') {
    ticket.status = 'IN_PROGRESS';
  }

  return sendSuccess(res, ticket, 'Message delivered');
});

// Admin get all tickets
router.get('/admin/all', authenticateToken, requireRoles('SUPER_ADMIN', 'SUPPORT_MANAGER'), (req: Request, res: Response) => {
  return sendSuccess(res, store.supportTickets, 'All support tickets');
});

// Admin update ticket status
router.put('/admin/:id/status', authenticateToken, requireRoles('SUPER_ADMIN', 'SUPPORT_MANAGER'), (req: Request, res: Response) => {
  const ticket = store.supportTickets.find(t => t.id === req.params.id);
  if (!ticket) return sendError(res, 'Ticket not found', 404);
  ticket.status = req.body.status || ticket.status;
  ticket.updatedAt = new Date().toISOString();
  return sendSuccess(res, ticket, 'Ticket status updated');
});

export default router;
