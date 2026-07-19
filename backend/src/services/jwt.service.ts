/**
 * @file jwt.service.ts
 * @description JSON Web Token creation and verification utilities.
 *
 * Provides four pure functions for working with access and refresh tokens:
 *  - `generateAccessToken`  — signs a short-lived access token (default: 15 min)
 *  - `verifyAccessToken`    — validates and decodes an access token
 *  - `generateRefreshToken` — signs a long-lived refresh token (default: 7 days)
 *  - `verifyRefreshToken`   — validates and decodes a refresh token
 *
 * All signing secrets and expiry durations are sourced from the validated
 * `env` singleton so they are guaranteed to be present at runtime.
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

/**
 * Payload embedded in access tokens.
 * Contains only the minimum identity information needed to authorise a request.
 */
interface AccessTokenPayload {
  /** The unique user ID from the database. */
  userId: string;
  /** The user's role, used for route-level authorisation checks. */
  role: Role;
}

/**
 * Payload embedded in refresh tokens.
 * Intentionally minimal — only the user ID is needed to issue a new access token.
 */
interface RefreshTokenPayload {
  /** The unique user ID from the database. */
  userId: string;
}

/**
 * Generates a signed JWT access token.
 *
 * @param payload - Object containing `userId` and `role` to embed in the token.
 * @returns A signed JWT string valid for the duration configured in `JWT_EXPIRES_IN`.
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT access token and returns its decoded payload.
 *
 * @param token - The raw JWT string extracted from the Authorization header.
 * @returns The decoded `AccessTokenPayload` if the token is valid.
 * @throws {JsonWebTokenError} If the token is malformed or signature is invalid.
 * @throws {TokenExpiredError} If the token has expired.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as AccessTokenPayload;
}

/**
 * Generates a signed JWT refresh token.
 *
 * @param payload - Object containing `userId` to embed in the token.
 * @returns A signed JWT string valid for the duration configured in `JWT_REFRESH_EXPIRES_IN`.
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT refresh token and returns its decoded payload.
 *
 * @param token - The raw JWT refresh token string.
 * @returns The decoded `RefreshTokenPayload` if the token is valid.
 * @throws {JsonWebTokenError} If the token is malformed or signature is invalid.
 * @throws {TokenExpiredError} If the token has expired.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  return decoded as RefreshTokenPayload;
}
