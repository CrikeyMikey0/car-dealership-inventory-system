/**
 * @file vehicle.routes.ts
 * @description Express router for vehicle inventory endpoints.
 *
 * All routes are mounted under the /api/vehicles prefix (set in routes/index.ts).
 *
 * Route table:
 *  GET    /api/vehicles            — List vehicles with filtering and pagination (public)
 *  POST   /api/vehicles            — Create a new vehicle (ADMIN only)
 *  GET    /api/vehicles/search     — Keyword/filter search for vehicles (public)
 *  GET    /api/vehicles/:id        — Get a single vehicle by ID (public)
 *  PUT    /api/vehicles/:id        — Update vehicle details (ADMIN only)
 *  DELETE /api/vehicles/:id        — Delete a vehicle (ADMIN only)
 *  POST   /api/vehicles/:id/purchase — Purchase (reduce stock) a vehicle (authenticated users)
 *  POST   /api/vehicles/:id/restock  — Restock (increase stock) a vehicle (ADMIN only)
 *
 * Important: The /search route must be registered BEFORE /:id so that
 * "search" is not treated as a dynamic ID parameter by Express.
 */

import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { createVehicleSchema, getVehiclesQuerySchema, searchVehiclesQuerySchema, updateVehicleSchema, purchaseVehicleSchema, restockVehicleSchema } from '../schemas/vehicle.schema';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const controller = new VehicleController();

// GET /api/vehicles — public; supports filtering, sorting, and pagination via query params
router.get(
  '/',
  validateQuery(getVehiclesQuerySchema),  // Parse and validate query string parameters
  asyncHandler(controller.getVehicles)
);

// POST /api/vehicles — ADMIN only; creates a new vehicle in the inventory
router.post(
  '/',
  asyncHandler(authenticate),   // Verify Bearer token
  authorize('ADMIN'),           // Restrict to ADMIN role
  validateBody(createVehicleSchema),
  asyncHandler(controller.createVehicle)
);

// GET /api/vehicles/search — public; must come before /:id to avoid route shadowing
router.get(
  '/search',
  validateQuery(searchVehiclesQuerySchema),
  asyncHandler(controller.searchVehicles)
);

// GET /api/vehicles/:id — public; returns details for a single vehicle
router.get(
  '/:id',
  asyncHandler(controller.getVehicleById)
);

// PUT /api/vehicles/:id — ADMIN only; updates vehicle details (partial update supported)
router.put(
  '/:id',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  validateBody(updateVehicleSchema),
  asyncHandler(controller.updateVehicle)
);

// DELETE /api/vehicles/:id — ADMIN only; hard-deletes the vehicle record
router.delete(
  '/:id',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  asyncHandler(controller.deleteVehicle)
);

// POST /api/vehicles/:id/purchase — authenticated users (USER or ADMIN) can purchase
router.post(
  '/:id/purchase',
  asyncHandler(authenticate),   // Any authenticated user may purchase
  validateBody(purchaseVehicleSchema),
  asyncHandler(controller.purchaseVehicle)
);

// POST /api/vehicles/:id/restock — ADMIN only; increases inventory quantity
router.post(
  '/:id/restock',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  validateBody(restockVehicleSchema),
  asyncHandler(controller.restockVehicle)
);

export default router;
