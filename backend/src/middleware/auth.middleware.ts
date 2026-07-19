/**
 * @file auth.middleware.ts
 * @description Express middleware for JWT-based authentication and role authorisation.
 *
 * Exports two middleware factories:
 *  - `authenticate` — verifies the Bearer token and attaches the user to `req.user`.
 *  - `authorize`    — restricts a route to specific roles (call after `authenticate`).
 *
 * Usage example:
 * ```ts
 * router.delete('/:id', asyncHandler(authenticate), authorize('ADMIN'), handler);
 * ```
 */

import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../errors/app-error';
import { verifyAccessToken } from '../services/jwt.service';
import { UserRepository } from '../repositories/user.repository';

// A single UserRepository instance shared across all incoming requests.
// Creating it outside the middleware functions avoids re-instantiation overhead.
const userRepository = new UserRepository();

/**
 * Authentication middleware.
 *
 * Extracts the `Authorization: Bearer <token>` header, verifies the JWT
 * signature and expiry, fetches the corresponding user from the database,
 * and attaches the (password-stripped) user object to `req.user`.
 *
 * Calls `next(AppError)` with an appropriate 401 status if:
 *  - The Authorization header is missing or malformed.
 *  - The token has expired (`TokenExpiredError`).
 *  - The token signature is invalid.
 *  - The token's user ID no longer exists in the database.
 *
 * @param req  - Express request object.
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 */
export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(new AppError(401, 'Authentication token required'));
  }

  if (!authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Invalid authorization header format'));
  }

  // Remove the "Bearer " prefix (7 characters) to get the raw token
  const token = authHeader.substring(7);

  try {
    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    // Strip the password hash before attaching the user to the request object
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
 * Role-based authorisation middleware factory.
 *
 * Returns a middleware function that allows only users whose role is in the
 * supplied `allowedRoles` list.  Must be called **after** `authenticate`
 * so that `req.user` is populated.
 *
 * @param allowedRoles - One or more `Role` values (e.g. `'ADMIN'`, `'USER'`).
 * @returns Express middleware that forwards a 403 error if the user lacks
 *          the required role.
 *
 * @example
 * router.post('/', authenticate, authorize('ADMIN'), createHandler);
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      // This should not occur if authenticate ran first, but guard defensively
      return next(new AppError(401, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(403, 'Forbidden: You do not have permission to access this resource'));
    }

    next();
  };
}
