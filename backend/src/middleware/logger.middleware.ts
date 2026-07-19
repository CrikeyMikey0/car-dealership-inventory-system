/**
 * @file logger.middleware.ts
 * @description Lightweight HTTP request logging middleware.
 *
 * Logs each request to stdout in the format:
 *   [METHOD] /path/to/route - Status: 200 - Duration: 12.34ms
 *
 * Timing is captured using `process.hrtime()` for nanosecond precision,
 * and the log entry is written on the `finish` event (after the response
 * headers have been flushed) so the status code is available.
 *
 * This is a minimal internal logger.  For production deployments consider
 * replacing this with a structured logging library (e.g. `pino`, `winston`)
 * that supports JSON output, log levels, and external transports.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware that logs HTTP method, URL, response status code,
 * and total request duration in milliseconds.
 *
 * @param req  - Express request object.
 * @param res  - Express response object (the `finish` event is used for timing).
 * @param next - Express next function; called immediately so the chain continues.
 */
export function logger(req: Request, res: Response, next: NextFunction): void {
  // Capture start time with high-resolution timer before handing off to handlers
  const start = process.hrtime();

  res.on('finish', () => {
    // Calculate elapsed time in milliseconds from the high-resolution tuple [seconds, nanoseconds]
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    console.log(`[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${durationInMs}ms`);
  });

  next();
}
