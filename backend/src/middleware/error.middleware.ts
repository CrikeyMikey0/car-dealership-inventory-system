import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ValidationError, ValidationErrorItem } from '../errors/validation-error';

/**
 * Handles 404 errors for route paths that do not exist.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
}

/**
 * Global centralized error handler middleware.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: ValidationErrorItem[] | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    
    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  }

  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
