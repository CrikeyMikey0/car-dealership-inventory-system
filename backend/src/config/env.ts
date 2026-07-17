import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validates a configuration object against the environment schema.
 * Throws an error if validation fails.
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

// In test environment, provide a default DATABASE_URL on process.env if not set to prevent startup crashes
if (process.env.NODE_ENV === 'test' && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/test_db';
}

// Export parsed environment variables as a singleton
export const env = validateEnv(process.env);
