import { Vehicle, Prisma } from '@prisma/client';
import prisma from '../config/database';

export class VehicleRepository {
  /**
   * Creates a new vehicle in the database.
   */
  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  /**
   * Finds a vehicle by its unique ID.
   */
  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  /**
   * Finds all vehicles satisfying query parameters.
   */
  async findAll(params: {
    skip: number;
    take: number;
    where: Prisma.VehicleWhereInput;
    orderBy: Prisma.VehicleOrderByWithRelationInput;
  }): Promise<{ data: Vehicle[]; total: number }> {
    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where: params.where,
        skip: params.skip,
        take: params.take,
        orderBy: params.orderBy,
      }),
      prisma.vehicle.count({
        where: params.where,
      }),
    ]);

    return { data, total };
  }

  /**
   * Searches for vehicles matching where condition.
   */
  async search(where: Prisma.VehicleWhereInput, take: number = 50): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where,
      take,
    });
  }

  /**
   * Updates an existing vehicle.
   */
  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  /**
   * Permanently deletes a vehicle from the database.
   */
  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
