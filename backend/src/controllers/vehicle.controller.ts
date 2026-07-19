/**
 * @file vehicle.controller.ts
 * @description HTTP controller for vehicle inventory endpoints.
 *
 * Each handler extracts data from the validated Express request and
 * delegates all business logic to `VehicleService`.  Controllers are
 * kept thin on purpose — they are only responsible for the HTTP layer.
 *
 * Routes that use these handlers:
 *  - GET    /api/vehicles            — list vehicles (public)
 *  - POST   /api/vehicles            — create vehicle (ADMIN)
 *  - GET    /api/vehicles/search     — search vehicles (public)
 *  - GET    /api/vehicles/:id        — get vehicle by ID (public)
 *  - PUT    /api/vehicles/:id        — update vehicle (ADMIN)
 *  - DELETE /api/vehicles/:id        — delete vehicle (ADMIN)
 *  - POST   /api/vehicles/:id/purchase — purchase vehicle (authenticated)
 *  - POST   /api/vehicles/:id/restock  — restock vehicle (ADMIN)
 */

import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';

/**
 * Controller class for vehicle inventory operations.
 *
 * Instantiates a single `VehicleService` per controller instance and
 * exposes arrow-function handlers so they retain the correct `this`
 * context when passed directly to `asyncHandler()`.
 */
export class VehicleController {
  private vehicleService = new VehicleService();

  /**
   * Handles POST /api/vehicles.
   *
   * Creates a new vehicle record in the inventory.  Returns the created
   * vehicle with HTTP 201 Created.  Requires ADMIN role.
   */
  createVehicle = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      data: vehicle,
    });
  };

  /**
   * Handles GET /api/vehicles/:id.
   *
   * Returns the details of a single vehicle by its database ID.
   * Returns HTTP 404 if no vehicle with that ID exists.
   */
  getVehicleById = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.getVehicleById(req.params.id);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  };

  /**
   * Handles GET /api/vehicles.
   *
   * Returns a paginated, filtered, and sorted list of vehicles.  Query
   * parameters are parsed and validated by the `validateQuery` middleware
   * before this handler is invoked.
   */
  getVehicles = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as Parameters<typeof this.vehicleService.getVehicles>[0];
    const paginatedVehicles = await this.vehicleService.getVehicles(query);
    res.status(200).json({
      success: true,
      data: paginatedVehicles,
    });
  };

  /**
   * Handles GET /api/vehicles/search.
   *
   * Returns vehicles matching the supplied keyword / filter query.
   * Unlike `getVehicles`, results are not paginated.
   */
  searchVehicles = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as Parameters<typeof this.vehicleService.searchVehicles>[0];
    const vehicles = await this.vehicleService.searchVehicles(query);
    res.status(200).json({
      success: true,
      data: vehicles,
    });
  };

  /**
   * Handles PUT /api/vehicles/:id.
   *
   * Applies a partial update to an existing vehicle.  Only the supplied
   * fields are changed.  Returns HTTP 404 if the vehicle does not exist.
   * Requires ADMIN role.
   */
  updateVehicle = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  };

  /**
   * Handles DELETE /api/vehicles/:id.
   *
   * Permanently deletes a vehicle from the database.  Returns HTTP 404
   * if the vehicle does not exist.  Requires ADMIN role.
   */
  deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    await this.vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  };

  /**
   * Handles POST /api/vehicles/:id/purchase.
   *
   * Decrements the vehicle's inventory quantity by the purchased amount.
   * Returns HTTP 404 if the vehicle does not exist and HTTP 422 if stock
   * is insufficient to fulfil the request.  Requires authentication.
   */
  purchaseVehicle = async (req: Request, res: Response): Promise<void> => {
    const updatedVehicle = await this.vehicleService.purchaseVehicle(req.params.id, req.body.quantity);
    res.status(200).json({
      success: true,
      data: updatedVehicle,
    });
  };

  /**
   * Handles POST /api/vehicles/:id/restock.
   *
   * Increments the vehicle's inventory quantity by the supplied amount.
   * Returns HTTP 404 if the vehicle does not exist.  Requires ADMIN role.
   */
  restockVehicle = async (req: Request, res: Response): Promise<void> => {
    const updatedVehicle = await this.vehicleService.restockVehicle(req.params.id, req.body.quantity);
    res.status(200).json({
      success: true,
      data: updatedVehicle,
    });
  };
}
