/**
 * @file app.ts
 * @description Express application factory.
 *
 * Configures and returns the Express application instance with all
 * middleware, routing, and error-handling layers applied in order.
 * This module is intentionally separate from server.ts so the app
 * can be imported in tests without binding to a port.
 */

import express, { Express } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import healthRouter from './routes/health.routes';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

/**
 * Creates and configures a new Express application instance.
 *
 * Middleware is registered in a deliberate order:
 *  1. Request logger — captures timing data before any parsing happens.
 *  2. Security headers — sets standard headers (nosniff, frame protection, etc.).
 *  3. CORS — allows cross-origin requests from the configured origins.
 *  4. Body parsers — parses JSON and URL-encoded request bodies.
 *  5. Health check — root level endpoint.
 *  6. API router — all /api/* routes are delegated here.
 *  7. 404 handler — catches requests that matched no route.
 *  8. Global error handler — formats and returns all thrown errors.
 *
 * @returns A fully configured Express application ready to be started.
 */
export function createApp(): Express {
  const app = express();

  // Logging middleware first — must run before body parsers so timing
  // captures the full request lifecycle including parsing overhead.
  app.use(logger);

  // Security headers middleware
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  });

  // CORS configuration options
  const allowedOrigins = env.FRONTEND_URL 
    ? env.FRONTEND_URL.split(',').map(o => o.trim().replace(/\/+$/, '')) 
    : [];

  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // In non-production environments or if origin is not specified (e.g. same-origin, curl), allow it.
      if (env.NODE_ENV !== 'production' || !origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin "${origin}" is not in the allowed list:`, allowedOrigins);
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  };
  app.use(cors(corsOptions));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root-level health endpoint (makes GET /health work)
  app.use(healthRouter);

  // Mount all versioned API routes under the /api prefix (makes GET /api/health and others work)
  app.use('/api', apiRouter);

  // Catch-all for unknown routes — must come after all valid route definitions
  app.use(notFoundHandler);

  // Central error handler — must be the last middleware registered (4 arguments)
  app.use(errorHandler);

  return app;
}
