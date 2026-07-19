/**
 * @file health.routes.ts
 * @description Health-check endpoint router.
 *
 * Provides a single unauthenticated GET endpoint that external monitors
 * (uptime services, Docker health checks, Kubernetes liveness probes) can
 * poll to verify the server process is running and accepting connections.
 *
 * Endpoint: GET /api/health
 * Response: 200 OK — { success: true, message: "Server is running" }
 */

import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

/**
 * GET /health
 * GET /api/health
 *
 * Returns a 200/503 response check indicating system health and database connectivity.
 */
router.get('/health', async (_req, res) => {
  let dbStatus = 'connected';
  try {
    // Execute a simple query to verify db connection
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error('Healthcheck DB connection error:', error);
    dbStatus = 'disconnected';
  }

  const isHealthy = dbStatus === 'connected';
  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

export default router;
