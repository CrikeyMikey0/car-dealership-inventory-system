import express, { Express } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { logger } from './middleware/logger.middleware';

export function createApp(): Express {
  const app = express();

  // Logging middleware first
  app.use(logger);

  // Standard Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api', apiRouter);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
