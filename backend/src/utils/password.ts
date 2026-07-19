/**
 * @file password.ts
 * @description Password hashing and comparison utilities.
 *
 * Wraps `bcryptjs` to provide async functions for:
 *  - Hashing plain-text passwords before storing them in the database.
 *  - Comparing a supplied plain-text password against a stored hash.
 *
 * The number of bcrypt salt rounds is read from the validated `env`
 * singleton so it can be tuned per environment without code changes.
 */

import bcrypt from 'bcryptjs';
import { env } from '../config/env';

/**
 * Hashes a plain-text password using bcryptjs.
 *
 * Salt rounds are sourced from `env.BCRYPT_SALT_ROUNDS` (default: 10).
 * Higher values increase security at the cost of CPU time — do not set
 * this above ~14 in production without load-testing first.
 *
 * @param password - The plain-text password to hash.
 * @returns A promise that resolves to the bcrypt hash string.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

/**
 * Compares a plain-text password against a bcrypt hash.
 *
 * Uses a constant-time comparison internally to prevent timing attacks.
 *
 * @param password - The plain-text password supplied by the user.
 * @param hash     - The bcrypt hash stored in the database.
 * @returns A promise that resolves to `true` if the password matches, `false` otherwise.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
