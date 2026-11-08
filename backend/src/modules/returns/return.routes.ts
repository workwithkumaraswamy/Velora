import { Router, Request, Response } from 'express';
import { store } from '../../utils/store';
import { sendSuccess, sendError } from '../../utils/response';
import { authenticateToken, requireRoles } from '../../middleware/auth';
import { AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

// Customer creates return request
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { orderId, reason, detailedReason, bankDetails, proofImages } = req.body;
  if (!orderId || !reason) {
    return sendError(res, 'Order ID and return reason are required', 400);
  }

  const order = store.orders.find(o => o.id === orderId && o.userId === req.user?.userId);
  if (!order) {
    return sendError(res, 'Order not found in your account history', 404);
  }

  const newReturn = {
    id: `ret-${Date.now()}`,
    orderId,
    orderNumber: order.orderNumber,
    userId: req.user?.userId,
    customerName: `${order.user?.firstName} ${order.user?.lastName}`,
    reason,
    detailedReason: detailedReason || '',
    status: 'PENDING',
    refundAmount: order.totalAmount,
    bankDetails: bankDetails || '',
    proofImages: proofImages || [],
    requestedAt: new Date().toISOString()
  };

  store.returnRequests.unshift(newReturn);
  order.status = 'RETURN_REQUESTED';

  return sendSuccess(res, newReturn, 'Return request submitted. Our concierge team will review within 24 hours.', 201);
});

// Customer gets their return requests
router.get('/my-returns', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const userReturns = store.returnRequests.filter(r => r.userId === req.user?.userId);
  return sendSuccess(res, userReturns, 'My return requests');
});

// Admin gets all return requests
router.get('/admin/all', authenticateToken, requireRoles('SUPER_ADMIN', 'SUPPORT_MANAGER', 'ORDER_MANAGER'), (req: Request, res: Response) => {
  return sendSuccess(res, store.returnRequests, 'All return requests');
});

// Admin updates return request status & issues refund
router.put('/admin/:id', authenticateToken, requireRoles('SUPER_ADMIN', 'SUPPORT_MANAGER', 'ORDER_MANAGER'), (req: Request, res: Response) => {
  const { status, adminNotes } = req.body;
  const ret = store.returnRequests.find(r => r.id === req.params.id);
  if (!ret) return sendError(res, 'Return request not found', 404);

  ret.status = status;
  if (adminNotes) ret.adminNotes = adminNotes;
  if (status === 'APPROVED' || status === 'REFUND_ISSUED') {
    ret.resolvedAt = new Date().toISOString();
    const order = store.orders.find(o => o.id === ret.orderId);
    if (order) {
      order.status = status === 'REFUND_ISSUED' ? 'REFUNDED' : 'RETURNED';
      order.paymentStatus = 'REFUNDED';
    }
  }

  return sendSuccess(res, ret, 'Return request updated');
});

export default router;
