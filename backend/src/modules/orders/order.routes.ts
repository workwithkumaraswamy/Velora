import { Router } from 'express';
import { OrderController } from './order.controller';
import { authenticateToken, optionalAuth, requireRoles } from '../../middleware/auth';

const router = Router();

// Customer checkout (supports authenticated user or guest with email/phone)
router.post('/checkout', optionalAuth, OrderController.checkout);
router.post('/verify-payment', OrderController.verifyPayment);

// Customer order tracking
router.get('/my-orders', authenticateToken, OrderController.getMyOrders);
router.get('/track/:identifier', OrderController.getOrderById);

// Admin order management
router.get(
  '/admin/all',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ORDER_MANAGER', 'MENS_MANAGER', 'WOMENS_MANAGER', 'KIDS_MANAGER'),
  OrderController.getAllOrdersAdmin
);

router.put(
  '/admin/:id/status',
  authenticateToken,
  requireRoles('SUPER_ADMIN', 'ORDER_MANAGER'),
  OrderController.updateStatusAdmin
);

export default router;
