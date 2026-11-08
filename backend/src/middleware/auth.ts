import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { sendError } from '../utils/response';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return sendError(res, 'Access denied. Authentication token required.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as AuthUserPayload;
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Session token expired. Please refresh or login again.', 401);
    }
    return sendError(res, 'Invalid or malformed authentication token.', 401);
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthUserPayload;
      req.user = decoded;
    } catch {
      // Ignore if optional
    }
  }
  next();
};

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    // Super Admin has universal access
    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, 'Forbidden: Insufficient privileges for this department/operation', 403);
    }

    next();
  };
};

export const requireDepartmentAccess = (departmentSlug: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401);
    }

    if (req.user.role === 'SUPER_ADMIN') {
      return next();
    }

    const deptMap: Record<string, string> = {
      'men': 'MENS_MANAGER',
      'women': 'WOMENS_MANAGER',
      'kids': 'KIDS_MANAGER',
    };

    const requiredRole = deptMap[departmentSlug.toLowerCase()];
    if (requiredRole && req.user.role === requiredRole) {
      return next();
    }

    return sendError(res, `Forbidden: You do not have permissions to manage the ${departmentSlug} department.`, 403);
  };
};
