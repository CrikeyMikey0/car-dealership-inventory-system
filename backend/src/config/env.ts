/**
 * @file env.ts
 * @description Environment variable loading, validation, and export.
 *
 * Uses `zod` to parse and validate `process.env` against a strict schema
 * at module load time.  If any required variable is missing or has an
 * invalid format the application throws immediately — preventing hard-to-
 * debug runtime errors caused by a mis-configured environment.
 *
 * The validated, type-safe `env` object is exported as a singleton so the
 * rest of the codebase can import it without calling `process.env` directly.
 */

import { z } from 'zod';
import dotenv from 'dotenv';

// Load variables from the .env file into process.env.
// This is a no-op when the variables are already set (e.g. via Docker).
dotenv.config();

/**
 * Zod schema that describes every environment variable the application
 * requires.  Coercions (e.g. `z.coerce.number`) convert the raw string
 * values that `process.env` always provides into the correct JS types.
 *
 * The `.transform()` step fills in `JWT_REFRESH_SECRET` from `JWT_SECRET`
 * when not explicitly provided, reducing the number of required secrets
 * in simple deployments.
 */
const envSchema = z.object({
  /** TCP port the HTTP server will listen on. Defaults to 5000. */
  PORT: z.coerce.number().default(5000),
  /** PostgreSQL connection string passed to the pg Pool. */
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  /** Runtime environment: controls logging verbosity and error detail. */
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  /** Secret used to sign and verify access JWTs. */
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  /** Lifetime of access tokens (e.g. "15m", "1h"). */
  JWT_EXPIRES_IN: z.string().default('15m'),
  /** Secret for refresh tokens; falls back to JWT_SECRET when absent. */
  JWT_REFRESH_SECRET: z.string().optional(),
  /** Lifetime of refresh tokens (e.g. "7d"). */
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  /** Number of bcrypt salt rounds for password hashing. */
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
}).transform((data) => ({
  ...data,
  // Default JWT_REFRESH_SECRET to JWT_SECRET so only one secret is needed
  // in environments where separate refresh-token signing is unnecessary.
  JWT_REFRESH_SECRET: data.JWT_REFRESH_SECRET || data.JWT_SECRET,
}));

/** Inferred TypeScript type of the validated environment object. */
export type Env = z.infer<typeof envSchema>;

/**
 * Validates a configuration object against the environment schema.
 *
 * Logs a detailed diff of all invalid fields before throwing so the
 * operator knows exactly which variables need to be fixed.
 *
 * @param config - Typically `process.env` cast to `Record<string, unknown>`.
 * @returns A validated, type-safe `Env` object.
 * @throws {Error} If one or more required variables are missing or invalid.
 */
export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    const errorDetails = result.error.format();
    console.error('Invalid environment variables:', errorDetails);
    throw new Error('Invalid environment variables');
  }

  return result.data;
}

// In test environment, provide safe default values for variables that
// are not set so unit tests can run without a real .env file.
if (process.env.NODE_ENV === 'test') {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test_db';
  }
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'test_jwt_secret_key_here';
  }
  if (!process.env.JWT_REFRESH_SECRET) {
    process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_here';
  }
}

/**
 * Validated environment variables singleton.
 *
 * Import this object instead of reading `process.env` directly so that
 * all values are guaranteed to be correctly typed and present.
 *
 * @example
 * import { env } from './config/env';
 * app.listen(env.PORT);
 */
export const env = validateEnv(process.env);
