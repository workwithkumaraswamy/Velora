import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';
import { AuthenticatedRequest } from '../../middleware/auth';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginSchema = z.object({
  credential: z.string().min(3, 'Email or phone required'),
  password: z.string().min(1, 'Password required'),
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated);
      return sendSuccess(res, result, 'Account registered successfully', 201);
    } catch (err: any) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated.credential, validated.password);
      return sendSuccess(res, result, 'Logged in successfully');
    } catch (err: any) {
      return sendError(res, err.message, 401);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) return sendError(res, 'Unauthorized', 401);
      const profile = await AuthService.getProfile(req.user.userId);
      return sendSuccess(res, profile, 'Profile retrieved');
    } catch (err: any) {
      next(err);
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user?.userId) return sendError(res, 'Unauthorized', 401);
      const updated = await AuthService.updateProfile(req.user.userId, req.body);
      return sendSuccess(res, updated, 'Profile updated successfully');
    } catch (err: any) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return sendError(res, 'Refresh token required', 400);
      const newToken = AuthService.verifyRefreshToken(refreshToken);
      return sendSuccess(res, { token: newToken }, 'Token refreshed');
    } catch (err: any) {
      return sendError(res, err.message, 401);
    }
  }
}
