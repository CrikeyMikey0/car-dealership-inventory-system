import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env';

interface AccessTokenPayload {
  userId: string;
  role: Role;
}

interface RefreshTokenPayload {
  userId: string;
}

/**
 * Generates a signed JWT access token.
 */
export function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT access token.
 * Throws an error if validation fails.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as AccessTokenPayload;
}

/**
 * Generates a signed JWT refresh token.
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT refresh token.
 * Throws an error if validation fails.
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
  return decoded as RefreshTokenPayload;
}
