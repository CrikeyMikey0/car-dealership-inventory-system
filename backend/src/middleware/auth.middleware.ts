import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../errors/app-error';
import { verifyAccessToken } from '../services/jwt.service';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

/**
 * Reusable authentication middleware.
 * Verifies Bearer JWT, fetches user, and attaches them to req.user.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(new AppError(401, 'Authentication token required'));
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Invalid authorization header format'));
  }

  const token = authHeader.substring(7);

  try {
    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    const safeUser = { ...user } as Omit<typeof user, 'password'> & { password?: string };
    delete safeUser.password;
    req.user = safeUser;
    next();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      return next(new AppError(401, 'Authentication token has expired'));
    }
    return next(new AppError(401, 'Invalid authentication token'));
  }
}

/**
 * Reusable role-based authorization middleware.
 * Restricts access to routes based on user role.
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden: You do not have permission to access this resource'));
    }

    next();
  };
}
