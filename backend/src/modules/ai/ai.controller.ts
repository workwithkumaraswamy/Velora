import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

export class AIController {
  static async generateDescription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AIService.generateDescription(req.body);
      return sendSuccess(res, result, 'AI product copy generated successfully');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async generateImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AIService.generateFashionImage(req.body);
      return sendSuccess(res, result, 'AI fashion photography generated');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }

  static async importSupplierProduct(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await AIService.importSupplierProduct(req.body);
      return sendSuccess(res, result, 'Supplier product parsed and enriched');
    } catch (err: any) {
      return sendError(res, err.message, 400);
    }
  }
}
