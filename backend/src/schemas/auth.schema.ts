/**
 * @file auth.schema.ts
 * @description Zod validation schemas for authentication request payloads.
 *
 * Each schema is used by the `validateBody` middleware to parse, validate,
 * and sanitise incoming request bodies before they reach the service layer.
 * TypeScript types are inferred directly from the schemas to ensure the
 * validation rules and type definitions stay in sync.
 */

import { z } from 'zod';

/**
 * Schema for POST /api/auth/register request body.
 *
 * Rules:
 *  - `name`     — required, trimmed, non-empty.
 *  - `email`    — required, trimmed, must be a valid email address.
 *  - `password` — required, minimum 6 characters.
 */
export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

/**
 * Schema for POST /api/auth/login request body.
 *
 * Rules:
 *  - `email`    — required, trimmed, must be a valid email address.
 *  - `password` — required, non-empty (length is not validated here — just presence).
 */
export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Schema for POST /api/auth/refresh request body.
 *
 * Rules:
 *  - `refreshToken` — required string.
 */
export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: 'Refresh token is required' }),
});

/**
 * Schema for POST /api/auth/change-password request body.
 *
 * Rules:
 *  - `currentPassword` — required, non-empty.
 *  - `newPassword`     — required, between 6 and 50 characters.
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string({ required_error: 'Current password is required' })
    .min(1, 'Current password cannot be empty'),
  newPassword: z.string({ required_error: 'New password is required' })
    .min(6, 'New password must be at least 6 characters')
    .max(50, 'New password must not exceed 50 characters'),
});

/** TypeScript type inferred from {@link registerSchema}. */
export type RegisterInput = z.infer<typeof registerSchema>;
/** TypeScript type inferred from {@link loginSchema}. */
export type LoginInput = z.infer<typeof loginSchema>;
/** TypeScript type inferred from {@link refreshSchema}. */
export type RefreshInput = z.infer<typeof refreshSchema>;
/** TypeScript type inferred from {@link changePasswordSchema}. */
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
