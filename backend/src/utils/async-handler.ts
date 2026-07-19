/**
 * @file async-handler.ts
 * @description Async route handler wrapper for Express.
 *
 * Express 4.x does not natively handle promise rejections in async route
 * handlers — an unhandled rejection will crash the process.  This utility
 * wraps an async handler in a `Promise.resolve().catch(next)` call so that
 * any thrown error or rejected promise is forwarded to the next error-
 * handling middleware (i.e. the global `errorHandler`).
 *
 * @example
 * router.get('/vehicles', asyncHandler(controller.getVehicles));
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

/** The type signature of an async Express route handler. */
type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Wraps an async Express route handler to automatically forward any
 * thrown errors or rejected promises to `next()`.
 *
 * Without this wrapper you would need to add `try/catch` in every handler
 * and call `next(error)` manually.  With it, you can write plain `async`
 * handlers and let the global error middleware take care of all failures.
 *
 * @param fn - An async Express request handler.
 * @returns A synchronous `RequestHandler` that Express can register directly.
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Wrap in Promise.resolve to handle both synchronous throws and
    // async rejections uniformly, forwarding all errors to next().
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
