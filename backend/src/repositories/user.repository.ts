/**
 * @file user.repository.ts
 * @description Data access layer for the `User` model.
 *
 * Provides typed CRUD operations over the Prisma `user` table.
 * All database interactions go through this class so that the rest of
 * the codebase never imports Prisma directly, making it easier to swap
 * the ORM or mock the data layer in tests.
 */

import { User, Prisma } from '@prisma/client';
import prisma from '../config/database';

/**
 * Repository class for user-related database operations.
 */
export class UserRepository {
  /**
   * Finds a user by their email address.
   *
   * Used during login and registration to check for existing accounts.
   *
   * @param email - The email address to look up (case-sensitive, stored as-is).
   * @returns The matching `User` record, or `null` if none exists.
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Finds a user by their unique database ID.
   *
   * Used by authentication middleware to hydrate `req.user` after token
   * verification, and by services that need to look up a user by ID.
   *
   * @param id - The CUID/UUID primary key of the user record.
   * @returns The matching `User` record, or `null` if none exists.
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Creates a new user in the database.
   *
   * Expects `data.password` to already be hashed — this method performs
   * no additional hashing.
   *
   * @param data - Prisma-typed create input (name, email, hashed password, role).
   * @returns The newly created `User` record including the auto-generated ID and timestamps.
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Updates a user record by their unique ID.
   *
   * Accepts a partial `UserUpdateInput` so callers can update individual
   * fields (e.g. only the password hash) without re-supplying unchanged data.
   *
   * @param id - The CUID/UUID primary key of the user to update.
   * @param data - Prisma-typed partial update input.
   * @returns The updated `User` record.
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}
