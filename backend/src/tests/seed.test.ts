import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'child_process';
import prisma from '../config/database';

describe('Database Seed Script', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should execute seed script successfully and populate initial data', async () => {
    // Clean up database tables first to verify seed populates them
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    // Execute the seed script command
    const output = execSync('npx prisma db seed', {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });

    expect(output).toContain('Seeding completed successfully');

    // Verify seeded Users
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@dealership.com' },
    });
    expect(adminUser).not.toBeNull();
    expect(adminUser?.role).toBe('ADMIN');
    expect(adminUser?.name).toBe('System Administrator');

    const regularUser = await prisma.user.findUnique({
      where: { email: 'john@example.com' },
    });
    expect(regularUser).not.toBeNull();
    expect(regularUser?.role).toBe('USER');

    // Verify seeded Vehicles
    const vehicles = await prisma.vehicle.findMany();
    expect(vehicles.length).toBe(5);
    expect(vehicles.some(v => v.make === 'Tesla' && v.model === 'Model 3')).toBe(true);
  }, 15000);
});
