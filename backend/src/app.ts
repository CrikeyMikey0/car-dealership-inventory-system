import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from the local .env file before the app starts.
dotenv.config();

// Create a reusable app factory so tests can instantiate the server without
// binding to a fixed port or starting a global listener.
export function createApp() {
  const app = express();

  // Enable CORS so front-end clients can call the API from different origins.
  app.use(cors());

  // Parse JSON request bodies for future API routes.
  app.use(express.json());

  // Health check endpoint used by deployment checks and simple smoke tests.
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return app;
}

const app = createApp();
const PORT = process.env.PORT || 5000;

// Only start listening when this file is run directly, not during tests.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
