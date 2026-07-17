import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Attempts to connect to the database.
 * Throws an error if connection fails.
 */
export async function connectDB(): Promise<void> {
  await prisma.$connect();
}

export default prisma;
