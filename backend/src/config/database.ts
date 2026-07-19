/**
 * @file database.ts
 * @description Prisma client singleton and database connection helper.
 *
 * Uses the `@prisma/adapter-pg` driver adapter so that Prisma talks to
 * PostgreSQL through the standard `pg` connection pool rather than its
 * own internal connection management.  This adapter is required when
 * running Prisma in environments that do not support native bindings
 * (e.g. edge runtimes or the `pg` driver in non-Prisma setups).
 *
 * The singleton pattern prevents multiple PrismaClient instances from
 * being created during hot-reload in development (Next.js / ts-node-dev),
 * which would exhaust the database connection pool.
 */

import './env'; // Ensure env variables are loaded and validated first
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

/**
 * A type-safe handle to the global object so we can cache the
 * PrismaClient instance across hot-reloads in development without
 * TypeScript complaining about unknown properties on `globalThis`.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Shared `pg` connection pool.
 * All Prisma queries share this pool, giving us efficient connection
 * reuse and back-pressure handling provided by `pg.Pool`.
 */
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

/**
 * Prisma adapter that bridges the `pg` pool to Prisma's query engine.
 * Required when using the `@prisma/adapter-pg` driver adapter.
 */
const adapter = new PrismaPg(pool);

/**
 * Singleton Prisma client instance.
 *
 * In development, the instance is stored on `globalThis` so that
 * TypeScript's module hot-reload does not create a new client on every
 * change (which would exhaust the connection pool).
 *
 * In production, a fresh instance is created once and reused for the
 * lifetime of the process.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

// Cache the client on the global object in non-production environments
// to survive hot-module replacement without leaking connections.
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Attempts to connect to the database.
 *
 * Should be called once at server start-up before accepting requests.
 * Throws an error if the connection cannot be established, allowing the
 * caller to decide whether to exit the process or retry.
 *
 * @throws {Error} If the database is unreachable or credentials are invalid.
 */
export async function connectDB(): Promise<void> {
  await prisma.$connect();
}

export async function closeDB(): Promise<void> {
  await prisma.$disconnect();
  await pool.end();
}

export default prisma;
