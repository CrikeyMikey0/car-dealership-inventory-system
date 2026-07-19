/**
 * @file auth.routes.ts
 * @description Express router for authentication endpoints.
 *
 * All routes are mounted under the /api/auth prefix (set in routes/index.ts).
 *
 * Route table:
 *  POST /api/auth/register          — Register a new user account (public)
 *  POST /api/auth/login             — Authenticate and receive tokens (public)
 *  POST /api/auth/refresh           — Exchange a refresh token for a new access token (public)
 *  POST /api/auth/change-password   — Change the authenticated user's password (requires auth)
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const controller = new AuthController();

// POST /api/auth/register — public endpoint; no authentication required
router.post(
  '/register',
  validateBody(registerSchema),   // Validate and sanitise request body
  asyncHandler(controller.register)
);

// POST /api/auth/login — public endpoint; no authentication required
router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(controller.login)
);

// POST /api/auth/refresh — public endpoint; the refresh token IS the credential
router.post(
  '/refresh',
  validateBody(refreshSchema),
  asyncHandler(controller.refresh)
);

// POST /api/auth/change-password — requires a valid access token
router.post(
  '/change-password',
  authenticate,                         // Verify Bearer token and populate req.user
  validateBody(changePasswordSchema),   // Validate request body
  asyncHandler(controller.changePassword)
);

export default router;
