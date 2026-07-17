import { createApp } from './app';
import { env } from './config/env';
import { connectDB } from './config/database';

const app = createApp();

async function startServer() {
  try {
    // Verify database connection before starting the server
    await connectDB();
    console.log('Database connection successfully established.');

    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server due to connection or initialization error:', error);
    process.exit(1);
  }
}

startServer();
