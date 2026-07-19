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
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

/**
 * Creates and configures a new Express application instance.
 *
 * Middleware is registered in a deliberate order:
 *  1. Request logger — captures timing data before any parsing happens.
 *  2. CORS — allows cross-origin requests from the configured origins.
 *  3. Body parsers — parses JSON and URL-encoded request bodies.
 *  4. API router — all /api/* routes are delegated here.
 *  5. 404 handler — catches requests that matched no route.
 *  6. Global error handler — formats and returns all thrown errors.
 *
 * @returns A fully configured Express application ready to be started.
 */
export function createApp(): Express {
  const app = express();

  // Logging middleware first — must run before body parsers so timing
  // captures the full request lifecycle including parsing overhead.
  app.use(logger);

  // Standard middleware: cross-origin support and body parsing
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount all versioned API routes under the /api prefix
  app.use('/api', apiRouter);

  // Catch-all for unknown routes — must come after all valid route definitions
  app.use(notFoundHandler);

  // Central error handler — must be the last middleware registered (4 arguments)
  app.use(errorHandler);

  return app;
}
