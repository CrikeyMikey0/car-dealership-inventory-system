/**
 * @file error.middleware.ts
 * @description Centralised Express error-handling middleware.
 *
 * Exports two middleware functions that must be registered as the **last**
 * `app.use()` calls in the Express pipeline (after all route definitions):
 *  - `notFoundHandler` — catches any request that did not match a route.
 *  - `errorHandler`    — formats and serialises all errors into a consistent
 *                        JSON response structure.
 *
 * The error handler suppresses the stack trace in production to avoid
 * leaking implementation details to clients.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { ValidationError, ValidationErrorItem } from '../errors/validation-error';

/**
 * 404 catch-all middleware.
 *
 * Must be registered after all valid route definitions.  Converts any
 * unmatched request into an `AppError` with status 404 and passes it to
 * the next error handler.
 *
 * @param req  - Express request object (used to capture the unmatched URL).
 * @param _res - Express response object (unused).
 * @param next - Express next function.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Route ${req.originalUrl} not found`));
}

/**
 * Global centralised error handler middleware.
 *
 * Must be the **last** middleware registered (identified by its 4-argument
 * signature which Express uses to detect error handlers).
 *
 * Behaviour:
 *  - `AppError` instances use their own `statusCode` and `message`.
 *  - `ValidationError` instances additionally include a field-level `errors` array.
 *  - All other `Error` instances result in a generic 500 response.
 *  - The stack trace is included only in non-production environments.
 *
 * @param err  - The error thrown or passed to `next()`.
 * @param _req - Express request object (unused).
 * @param res  - Express response object used to send the JSON error payload.
 * @param _next - Express next function (required for 4-argument signature; unused).
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
    
    // Include field-level error details for validation failures
    if (err instanceof ValidationError) {
      errors = err.errors;
    }
  }

  // Suppress internal details (stack trace) from clients in production
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    success: false,
    message,
    // Spread field errors only when present (avoids an `errors: undefined` key)
    ...(errors ? { errors } : {}),
    // Include the stack trace only in non-production environments for debugging
    ...(isProduction ? {} : { stack: err.stack }),
  });
}
