/**
 * @file routes/index.ts
 * @description Root API router.
 *
 * Assembles all feature routers and mounts them under the `/api` prefix
 * (set in `app.ts`).  Adding a new feature router means importing it here
 * and registering it with `router.use()`.
 *
 * Current route prefixes:
 *  - (no prefix) — health check at GET /api/health
 *  - /auth       — authentication endpoints
 *  - /vehicles   — vehicle inventory endpoints
 */

import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import vehicleRouter from './vehicle.routes';

/** The root Express router shared by all API feature modules. */
const router = Router();

// Health check — mounted without a sub-prefix so the endpoint is GET /api/health
router.use(healthRouter);

// Authentication routes — mounted at /api/auth/*
router.use('/auth', authRouter);

// Vehicle inventory routes — mounted at /api/vehicles/*
router.use('/vehicles', vehicleRouter);

export default router;
