import { describe, it, expect, afterAll, beforeEach } from 'vitest';
import prisma from '../config/database';
import { Prisma } from '@prisma/client';

describe('Database Schema Constraints', () => {
  beforeEach(async () => {
    try {
      await prisma.vehicle.deleteMany();
      await prisma.user.deleteMany();
    } catch {
      // Ignore errors if database/tables are not set up yet
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a User successfully', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'USER' as const,
    };

    const user = await prisma.user.create({ data: userData });
    expect(user.id).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.role).toBe('USER');
  });

  it('should enforce unique email constraint on User', async () => {
    const userData1 = {
      name: 'User One',
      email: 'unique@example.com',
      password: 'password123',
      role: 'USER' as const,
    };

    const userData2 = {
      name: 'User Two',
      email: 'unique@example.com',
      password: 'password456',
      role: 'USER' as const,
    };

    await prisma.user.create({ data: userData1 });

    await expect(prisma.user.create({ data: userData2 })).rejects.toThrow();
  });

  it('should create a Vehicle successfully', async () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      category: 'Sedan',
      price: new Prisma.Decimal(25000.00),
      quantity: 5,
    };

    const vehicle = await prisma.vehicle.create({ data: vehicleData });
    expect(vehicle.id).toBeDefined();
    expect(vehicle.make).toBe('Toyota');
    expect(Number(vehicle.price)).toBe(25000.00);
    expect(vehicle.quantity).toBe(5);
  });

  it('should enforce non-negative price constraint on Vehicle', async () => {
    const invalidVehicle = {
      make: 'Toyota',
      model: 'Prius',
      year: 2023,
      category: 'Hybrid',
      price: new Prisma.Decimal(-100.00),
      quantity: 2,
    };

    await expect(prisma.vehicle.create({ data: invalidVehicle })).rejects.toThrow();
  });

  it('should enforce non-negative quantity constraint on Vehicle', async () => {
    const invalidVehicle = {
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      category: 'Sedan',
      price: new Prisma.Decimal(20000.00),
      quantity: -5,
    };

    await expect(prisma.vehicle.create({ data: invalidVehicle })).rejects.toThrow();
  });
});
