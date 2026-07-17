import { Request, Response, NextFunction } from 'express';

/**
 * Lightweight request logging middleware.
 * Logs HTTP method, request URL, response status, and execution duration.
 */
export function logger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    console.log(`[${req.method}] ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${durationInMs}ms`);
  });

  next();
}
