/**
 * @file server.ts
 * @description Application entry point.
 *
 * Bootstraps the Express server by:
 *  1. Creating the configured Express app via `createApp()`.
 *  2. Verifying a live database connection via `connectDB()`.
 *  3. Binding the HTTP server to the configured port.
 *
 * If the database connection fails the process exits immediately so the
 * container / process manager can restart it cleanly.
 */

import { createApp } from './app';
import { env } from './config/env';
import { connectDB, closeDB } from './config/database';

const app = createApp();
let server: any;

/**
 * Starts the HTTP server after confirming database connectivity.
 *
 * Exits the process with code 1 if the database connection cannot be
 * established, preventing the server from accepting requests in a broken
 * state.
 */
async function startServer() {
  try {
    // Verify database connection before binding to a port.
    // Throws if the connection string is wrong or the database is unreachable.
    await connectDB();
    console.log('Database connection successfully established.');

    server = app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server due to connection or initialization error:', error);
    // Exit so the process manager (PM2, Docker, etc.) can restart the service
    process.exit(1);
  }
}

/**
 * Performs a graceful shutdown of the HTTP server and database connections.
 */
async function gracefulShutdown(signal: string) {
  console.log(`Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed.');
      try {
        await closeDB();
        console.log('Database connection closed.');
        process.exit(0);
      } catch (err) {
        console.error('Error during database disconnect:', err);
        process.exit(1);
      }
    });

    // Force close connections after 10 seconds if they are hanging
    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();
