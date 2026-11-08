import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class ProductController {
  static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.getProducts(req.query as any);
      return sendSuccess(res, result.products, 'Products retrieved successfully', 200, result.pagination);
    } catch (err: any) {
      next(err);
    }
  }

  static async getProductBySlugOrId(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlugOrId(req.params.identifier);
      return sendSuccess(res, product, 'Product details retrieved');
    } catch (err: any) {
      return sendError(res, err.message, 404);
    }
  }

  static async createProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await ProductService.createProduct(req.body);
      return sendSuccess(res, created, 'Product created successfully', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async updateProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ProductService.updateProduct(req.params.id, req.body);
      return sendSuccess(res, updated, 'Product updated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async deleteProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await ProductService.deleteProduct(req.params.id);
      return sendSuccess(res, null, 'Product deleted successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
