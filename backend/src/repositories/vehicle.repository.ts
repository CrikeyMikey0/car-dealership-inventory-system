/**
 * @file vehicle.repository.ts
 * @description Data access layer for the `Vehicle` model.
 *
 * Provides typed CRUD operations and a search helper over the Prisma
 * `vehicle` table.  All database interactions go through this class so
 * that the rest of the codebase never imports Prisma directly, keeping
 * the data layer easy to mock in unit tests.
 */

import { Vehicle, Prisma } from '@prisma/client';
import prisma from '../config/database';

/**
 * Repository class for vehicle inventory database operations.
 */
export class VehicleRepository {
  /**
   * Creates a new vehicle record in the database.
   *
   * @param data - Prisma-typed create input (make, model, year, category, price, quantity).
   * @returns The newly created `Vehicle` record including the auto-generated ID and timestamps.
   */
  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({
      data,
    });
  }

  /**
   * Finds a single vehicle by its unique database ID.
   *
   * @param id - The CUID/UUID primary key of the vehicle record.
   * @returns The matching `Vehicle` record, or `null` if none exists.
   */
  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({
      where: { id },
    });
  }

  /**
   * Returns a paginated, filtered, and sorted list of vehicles.
   *
   * Executes the `findMany` and `count` queries in parallel using
   * `Promise.all` for optimal performance on large datasets.
   *
   * @param params.skip - Number of records to skip (offset).
   * @param params.take - Maximum number of records to return (page size).
   * @param params.where - Prisma filter conditions (make, category, price range, etc.).
   * @param params.orderBy - Field and direction to sort by.
   * @returns An object with `data` (the current page of vehicles) and
   *          `total` (the total matching record count for pagination UI).
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
   * Searches for vehicles matching the supplied Prisma `where` clause.
   *
   * Unlike `findAll`, this method does not paginate — it returns at most
   * `take` results and is intended for autocomplete / type-ahead use cases.
   *
   * @param where - Prisma filter conditions (supports OR clauses for keyword search).
   * @param take - Upper bound on the number of results returned. Defaults to 50.
   * @returns An array of matching `Vehicle` records.
   */
  async search(where: Prisma.VehicleWhereInput, take: number = 50): Promise<Vehicle[]> {
    return prisma.vehicle.findMany({
      where,
      take,
    });
  }

  /**
   * Updates an existing vehicle record.
   *
   * Accepts a partial `VehicleUpdateInput` so callers can update only the
   * fields that changed (e.g. just the quantity after a purchase).
   *
   * @param id - The CUID/UUID primary key of the vehicle to update.
   * @param data - Prisma-typed partial update input.
   * @returns The updated `Vehicle` record.
   */
  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  /**
   * Permanently deletes a vehicle from the database.
   *
   * This is a hard delete — there is no soft-delete or archive mechanism.
   * Ensure the vehicle exists before calling this method to get a meaningful
   * 404 error instead of a Prisma `RecordNotFound` exception.
   *
   * @param id - The CUID/UUID primary key of the vehicle to delete.
   * @returns The deleted `Vehicle` record (captured before deletion).
   */
  async delete(id: string): Promise<Vehicle> {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
