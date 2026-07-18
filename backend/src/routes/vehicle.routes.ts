import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { createVehicleSchema, getVehiclesQuerySchema, searchVehiclesQuerySchema, updateVehicleSchema, purchaseVehicleSchema, restockVehicleSchema } from '../schemas/vehicle.schema';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const controller = new VehicleController();

// Get all vehicles: Public
router.get(
  '/',
  validateQuery(getVehiclesQuerySchema),
  asyncHandler(controller.getVehicles)
);

// Create vehicle: ADMIN only
router.post(
  '/',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  validateBody(createVehicleSchema),
  asyncHandler(controller.createVehicle)
);

// Search vehicles: Public
router.get(
  '/search',
  validateQuery(searchVehiclesQuerySchema),
  asyncHandler(controller.searchVehicles)
);

// Get vehicle by ID: Public
router.get(
  '/:id',
  asyncHandler(controller.getVehicleById)
);

// Update vehicle details: ADMIN only
router.put(
  '/:id',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  validateBody(updateVehicleSchema),
  asyncHandler(controller.updateVehicle)
);

// Delete vehicle: ADMIN only
router.delete(
  '/:id',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  asyncHandler(controller.deleteVehicle)
);

// Purchase vehicle: authenticated users (USER or ADMIN)
router.post(
  '/:id/purchase',
  asyncHandler(authenticate),
  validateBody(purchaseVehicleSchema),
  asyncHandler(controller.purchaseVehicle)
);

// Restock vehicle: ADMIN only
router.post(
  '/:id/restock',
  asyncHandler(authenticate),
  authorize('ADMIN'),
  validateBody(restockVehicleSchema),
  asyncHandler(controller.restockVehicle)
);

export default router;
