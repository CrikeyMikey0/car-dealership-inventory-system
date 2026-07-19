/**
 * @file database.test.ts
 * @description Unit tests for the Prisma database configuration and connection logic.
 *
 * Mocks the Prisma client to verify that the `connectDB` helper function handles
 * connection success and failure correctly without requiring a real database instance.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@prisma/client', () => {
  return {
    PrismaClient: class {
      $connect = vi.fn();
      $disconnect = vi.fn();
    },
  };
});

import prisma, { connectDB } from '../config/database';

describe('Database Connection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should successfully establish database connection', async () => {
    const mockConnect = vi.mocked(prisma.$connect);
    mockConnect.mockResolvedValueOnce(undefined);

    await expect(connectDB()).resolves.toBeUndefined();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });

  it('should propagate database connection errors', async () => {
    const mockConnect = vi.mocked(prisma.$connect);
    const mockError = new Error('Database connection failed');
    mockConnect.mockRejectedValueOnce(mockError);

    await expect(connectDB()).rejects.toThrow('Database connection failed');
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
});
