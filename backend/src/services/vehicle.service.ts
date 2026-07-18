import { VehicleRepository } from '../repositories/vehicle.repository';
import { createVehicleSchema, getVehiclesQuerySchema, searchVehiclesQuerySchema, updateVehicleSchema } from '../schemas/vehicle.schema';
import { z } from 'zod';
import { AppError } from '../errors/app-error';
import { Prisma } from '@prisma/client';

type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
type GetVehiclesInput = z.infer<typeof getVehiclesQuerySchema>;
type SearchVehiclesInput = z.infer<typeof searchVehiclesQuerySchema>;
type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;

export class VehicleService {
  private vehicleRepository = new VehicleRepository();

  /**
   * Creates a new vehicle after executing business rules.
   */
  async createVehicle(input: CreateVehicleInput) {
    // Business rule: Vehicle price cannot be negative
    if (input.price < 0) {
      throw new AppError(400, 'Vehicle price cannot be negative');
    }

    // Business rule: Quantity cannot be negative
    if (input.quantity < 0) {
      throw new AppError(400, 'Vehicle quantity cannot become negative');
    }

    return this.vehicleRepository.create({
      make: input.make,
      model: input.model,
      year: input.year,
      category: input.category,
      price: input.price,
      quantity: input.quantity,
    });
  }

  /**
   * Retrieves a vehicle by ID. Throws 404 if not found.
   */
  async getVehicleById(id: string) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }
    return vehicle;
  }

  /**
   * Retrieves paginated list of vehicles with filtering and sorting.
   */
  async getVehicles(query: GetVehiclesInput) {
    const {
      page,
      limit,
      make,
      model,
      category,
      minPrice,
      maxPrice,
      minQuantity,
      maxQuantity,
      availability,
      sortBy,
      sortOrder,
    } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.VehicleWhereInput = {};

    if (make) {
      where.make = { equals: make, mode: 'insensitive' };
    }
    if (model) {
      where.model = { equals: model, mode: 'insensitive' };
    }
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }

    const quantityFilter: Prisma.IntFilter = {};
    if (minQuantity !== undefined) {
      quantityFilter.gte = minQuantity;
    }
    if (maxQuantity !== undefined) {
      quantityFilter.lte = maxQuantity;
    }
    if (availability !== undefined) {
      if (availability) {
        quantityFilter.gt = 0;
      } else {
        quantityFilter.equals = 0;
      }
    }
    if (Object.keys(quantityFilter).length > 0) {
      where.quantity = quantityFilter;
    }

    const orderBy = { [sortBy]: sortOrder };

    const { data, total } = await this.vehicleRepository.findAll({
      skip,
      take,
      where,
      orderBy,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      limit,
      total,
      totalPages,
    };
  }

  /**
   * Searches for vehicles based on criteria.
   */
  async searchVehicles(query: SearchVehiclesInput) {
    const { make, model, category, minPrice, maxPrice, keyword } = query;
    const where: Prisma.VehicleWhereInput = {};

    if (make) {
      where.make = { equals: make, mode: 'insensitive' };
    }
    if (model) {
      where.model = { equals: model, mode: 'insensitive' };
    }
    if (category) {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {
        ...(minPrice !== undefined ? { gte: minPrice } : {}),
        ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
      };
    }
    if (keyword) {
      where.OR = [
        { make: { contains: keyword, mode: 'insensitive' } },
        { model: { contains: keyword, mode: 'insensitive' } },
        { category: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    return this.vehicleRepository.search(where);
  }

  /**
   * Updates vehicle details. Throws 404 if not found.
   */
  async updateVehicle(id: string, input: UpdateVehicleInput) {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Vehicle not found');
    }

    // Business rule: Vehicle price cannot be negative
    if (input.price !== undefined && input.price < 0) {
      throw new AppError(400, 'Vehicle price cannot be negative');
    }

    // Business rule: Quantity cannot be negative
    if (input.quantity !== undefined && input.quantity < 0) {
      throw new AppError(400, 'Vehicle quantity cannot become negative');
    }

    return this.vehicleRepository.update(id, input);
  }

  /**
   * Deletes a vehicle. Throws 404 if not found.
   */
  async deleteVehicle(id: string) {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'Vehicle not found');
    }
    return this.vehicleRepository.delete(id);
  }

  /**
   * Purchases a vehicle, decreasing its inventory quantity. Enforces business rules.
   */
  async purchaseVehicle(id: string, purchaseQuantity: number) {
    if (purchaseQuantity <= 0) {
      throw new AppError(400, 'Purchase quantity must be positive');
    }

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    if (vehicle.quantity < purchaseQuantity) {
      throw new AppError(422, 'Insufficient inventory for this purchase');
    }

    const newQuantity = vehicle.quantity - purchaseQuantity;
    return this.vehicleRepository.update(id, { quantity: newQuantity });
  }

  /**
   * Restocks a vehicle, increasing its inventory quantity. Enforces business rules.
   */
  async restockVehicle(id: string, restockQuantity: number) {
    if (restockQuantity <= 0) {
      throw new AppError(400, 'Restock quantity must be positive');
    }

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError(404, 'Vehicle not found');
    }

    const newQuantity = vehicle.quantity + restockQuantity;
    return this.vehicleRepository.update(id, { quantity: newQuantity });
  }
}
