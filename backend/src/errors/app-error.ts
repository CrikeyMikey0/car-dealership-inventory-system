/**
 * @file app-error.ts
 * @description Base application error class.
 *
 * Extends the built-in `Error` class with an HTTP status code and an
 * `isOperational` flag that lets the global error handler distinguish
 * between expected business errors (e.g. 404 Not Found) and unexpected
 * programmer errors (e.g. unhandled promise rejections).
 *
 * All domain-specific errors should extend `AppError` so they are caught
 * and formatted consistently by `errorHandler` middleware.
 */

/**
 * Operational error with an associated HTTP status code.
 *
 * "Operational" means the error is expected (a known edge case in business
 * logic) and can be communicated safely to the client.  Non-operational
 * errors (e.g. database crashes) should be left as plain `Error` instances
 * and will be caught by the global error handler which returns a generic 500.
 *
 * @example
 * throw new AppError(404, 'Vehicle not found');
 */
export class AppError extends Error {
  /** HTTP status code to send in the response (e.g. 400, 401, 403, 404, 409). */
  public readonly statusCode: number;

  /**
   * `true` for expected business errors; `false` for unexpected programmer errors.
   * Used by the global error handler to decide whether to log a full stack trace.
   */
  public readonly isOperational: boolean;

  /**
   * @param statusCode   - The HTTP status code for the response.
   * @param message      - A human-readable error message safe to expose to clients.
   * @param isOperational - Whether this is an expected operational error. Defaults to `true`.
   */
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Restore the correct prototype chain broken by extending built-in Error in ES5 targets.
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture a clean stack trace excluding this constructor frame.
    Error.captureStackTrace(this, this.constructor);
  }
}
