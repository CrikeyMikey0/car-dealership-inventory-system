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
import { connectDB } from './config/database';

const app = createApp();

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

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server due to connection or initialization error:', error);
    // Exit so the process manager (PM2, Docker, etc.) can restart the service
    process.exit(1);
  }
}

startServer();
