import './env'; // Ensure env variables are loaded and validated first
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a single shared pg Pool and PrismaPg adapter
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Attempts to connect to the database.
 * Throws an error if connection fails.
 */
export async function connectDB(): Promise<void> {
  await prisma.$connect();
}

export default prisma;
