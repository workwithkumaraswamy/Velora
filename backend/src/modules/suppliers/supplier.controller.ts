import { Request, Response, NextFunction } from 'express';
import { SupplierService } from './supplier.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class SupplierController {
  static async getSuppliers(req: Request, res: Response, next: NextFunction) {
    try {
      const suppliers = await SupplierService.getSuppliers();
      return sendSuccess(res, suppliers, 'Suppliers retrieved');
    } catch (err: any) {
      next(err);
    }
  }

  static async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id);
      return sendSuccess(res, supplier, 'Supplier details');
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createSupplier(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await SupplierService.createSupplier(req.body);
      return sendSuccess(res, created, 'Supplier created successfully', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateSupplier(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await SupplierService.updateSupplier(req.params.id, req.body);
      return sendSuccess(res, updated, 'Supplier updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async deleteSupplier(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await SupplierService.deleteSupplier(req.params.id);
      return sendSuccess(res, null, 'Supplier deleted');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async getSupplierOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await SupplierService.getSupplierOrders();
      return sendSuccess(res, orders, 'Supplier orders retrieved');
    } catch (err: any) {
      next(err);
    }
  }

  static async updateSupplierOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await SupplierService.updateSupplierOrderStatus(
        req.params.id,
        req.body.status,
        req.body
      );
      return sendSuccess(res, updated, 'Supplier order status updated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
