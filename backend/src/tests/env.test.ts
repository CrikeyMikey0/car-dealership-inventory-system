/**
 * @file env.test.ts
 * @description Unit tests for environment variable validation logic.
 *
 * Ensures that the application's Zod schema correctly parses valid configurations
 * and throws descriptive errors when required environment variables are missing
 * or malformed (e.g., non-numeric port, missing secret).
 */

import { describe, it, expect } from 'vitest';
import { validateEnv } from '../config/env';

describe('Environment Variable Validation', () => {
  it('should successfully parse valid environment variables', () => {
    const validConfig = {
      PORT: '5000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      NODE_ENV: 'test',
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'refreshsecret',
      BCRYPT_ROUNDS: '12',
      FRONTEND_URL: 'http://localhost:3000,https://dealership.com',
    };

    const parsed = validateEnv(validConfig);
    expect(parsed.PORT).toBe(5000);
    expect(parsed.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/db');
    expect(parsed.NODE_ENV).toBe('test');
    expect(parsed.JWT_SECRET).toBe('supersecret');
    expect(parsed.JWT_REFRESH_SECRET).toBe('refreshsecret');
    expect(parsed.JWT_EXPIRES_IN).toBe('15m');
    expect(parsed.JWT_REFRESH_EXPIRES_IN).toBe('7d');
    expect(parsed.BCRYPT_ROUNDS).toBe(12);
    expect(parsed.FRONTEND_URL).toBe('http://localhost:3000,https://dealership.com');
  });

  it('should default PORT to 5000 if not provided', () => {
    const configWithoutPort = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      NODE_ENV: 'test',
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'refreshsecret',
    };

    const parsed = validateEnv(configWithoutPort);
    expect(parsed.PORT).toBe(5000);
  });

  it('should default NODE_ENV to development if not provided', () => {
    const configWithoutEnv = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'refreshsecret',
    };

    const parsed = validateEnv(configWithoutEnv);
    expect(parsed.NODE_ENV).toBe('development');
  });

  it('should throw an error if DATABASE_URL is missing', () => {
    const invalidConfig = {
      PORT: '5000',
      NODE_ENV: 'test',
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'refreshsecret',
    };

    expect(() => validateEnv(invalidConfig)).toThrow('Invalid environment variables');
  });

  it('should throw an error if DATABASE_URL is not a valid URL', () => {
    const invalidConfig = {
      DATABASE_URL: 'invalid-url',
      JWT_SECRET: 'supersecret',
      JWT_REFRESH_SECRET: 'refreshsecret',
    };

    expect(() => validateEnv(invalidConfig)).toThrow();
  });

  it('should throw an error if JWT_SECRET is missing', () => {
    const invalidConfig = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_REFRESH_SECRET: 'refreshsecret',
    };

    expect(() => validateEnv(invalidConfig)).toThrow();
  });

  it('should default JWT_REFRESH_SECRET to JWT_SECRET if missing', () => {
    const config = {
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      JWT_SECRET: 'supersecret',
    };

    const parsed = validateEnv(config);
    expect(parsed.JWT_REFRESH_SECRET).toBe('supersecret');
  });
});
