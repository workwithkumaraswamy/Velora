import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class OrderController {
  static async checkout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.createOrder(req.body, req.user?.userId);
      return sendSuccess(res, result, 'Order placed successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrderService.verifyRazorpayPayment(req.body);
      return sendSuccess(res, result, 'Payment verified and order confirmed');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) return sendError(res, 'Unauthorized', 401);
      const orders = await OrderService.getOrders({ userId: req.user.userId });
      return sendSuccess(res, orders, 'Orders retrieved');
    } catch (err: any) {
      next(err);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(req.params.identifier);
      return sendSuccess(res, order, 'Order retrieved');
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  // Admin routes
  static async getAllOrdersAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getOrders(req.query as any);
      return sendSuccess(res, orders, 'All orders retrieved');
    } catch (err: any) {
      next(err);
    }
  }

  static async updateStatusAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await OrderService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.body.trackingDetails
      );
      return sendSuccess(res, updated, 'Order status updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
