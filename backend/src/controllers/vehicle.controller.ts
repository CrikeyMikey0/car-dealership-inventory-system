import { Request, Response } from 'express';
import { VehicleService } from '../services/vehicle.service';

export class VehicleController {
  private vehicleService = new VehicleService();

  /**
   * Handles POST /api/vehicles request.
   */
  createVehicle = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.createVehicle(req.body);
    res.status(201).json({
      success: true,
      data: vehicle,
    });
  };

  /**
   * Handles GET /api/vehicles/:id request.
   */
  getVehicleById = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.getVehicleById(req.params.id);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  };

  /**
   * Handles GET /api/vehicles request.
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
   * Handles GET /api/vehicles/search request.
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
   * Handles PUT /api/vehicles/:id request.
   */
  updateVehicle = async (req: Request, res: Response): Promise<void> => {
    const vehicle = await this.vehicleService.updateVehicle(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: vehicle,
    });
  };

  /**
   * Handles DELETE /api/vehicles/:id request.
   */
  deleteVehicle = async (req: Request, res: Response): Promise<void> => {
    await this.vehicleService.deleteVehicle(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vehicle deleted successfully',
    });
  };

  /**
   * Handles POST /api/vehicles/:id/purchase request.
   */
  purchaseVehicle = async (req: Request, res: Response): Promise<void> => {
    const updatedVehicle = await this.vehicleService.purchaseVehicle(req.params.id, req.body.quantity);
    res.status(200).json({
      success: true,
      data: updatedVehicle,
    });
  };

  /**
   * Handles POST /api/vehicles/:id/restock request.
   */
  restockVehicle = async (req: Request, res: Response): Promise<void> => {
    const updatedVehicle = await this.vehicleService.restockVehicle(req.params.id, req.body.quantity);
    res.status(200).json({
      success: true,
      data: updatedVehicle,
    });
  };
}
