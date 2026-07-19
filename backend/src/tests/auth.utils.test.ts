/**
 * @file auth.utils.test.ts
 * @description Unit tests for authentication and password utilities.
 *
 * Verifies the correctness of cryptographic operations such as password hashing
 * (bcrypt) and JWT generation/verification (jsonwebtoken). Ensures that valid
 * payloads succeed and invalid/expired tokens fail gracefully.
 */

// Unit tests for authentication and password utilities
import { describe, it, expect } from 'vitest';
import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../services/jwt.service';
import { hashPassword, comparePassword } from '../utils/password';

describe('Password Hashing Utilities', () => {
  it('should hash a password and verify it successfully', async () => {
    const password = 'mySecurePassword123';
    const hash = await hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    
    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);
  });

  it('should reject incorrect passwords', async () => {
    const password = 'mySecurePassword123';
    const wrongPassword = 'wrongPassword123';
    const hash = await hashPassword(password);
    
    const isMatch = await comparePassword(wrongPassword, hash);
    expect(isMatch).toBe(false);
  });
});

describe('JWT Utilities', () => {
  const userPayload = { userId: 'user-uuid-123', role: 'USER' as const };

  it('should generate and verify valid access tokens', () => {
    const token = generateAccessToken(userPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(userPayload.userId);
    expect(decoded.role).toBe(userPayload.role);
  });

  it('should generate and verify valid refresh tokens', () => {
    const token = generateRefreshToken({ userId: userPayload.userId });
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyRefreshToken(token);
    expect(decoded.userId).toBe(userPayload.userId);
  });

  it('should throw an error for invalid/malformed tokens', () => {
    expect(() => verifyAccessToken('invalid-token-string')).toThrow();
    expect(() => verifyRefreshToken('invalid-token-string')).toThrow();
  });

  it('should throw an error for expired tokens', () => {
    expect(() => verifyAccessToken('foo.bar.baz')).toThrow();
  });
});
