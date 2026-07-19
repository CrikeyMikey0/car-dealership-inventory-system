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

const router = Router();

/**
 * GET /api/health
 *
 * Returns a 200 response when the server is operational.
 * Does not check database connectivity — use a dedicated readiness
 * probe for that if required.
 */
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

export default router;
