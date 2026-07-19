/**
 * @file logger.test.ts
 * @description Unit tests for the request logging middleware.
 *
 * Spies on `console.log` to ensure that incoming HTTP requests trigger
 * the custom logging format (METHOD PATH STATUS duration ms) without
 * breaking the request lifecycle.
 */

import express from 'express';
import request from 'supertest';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from '../middleware/logger.middleware';

describe('Logging Middleware', () => {
  const testApp = express();

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  testApp.use(logger);
  testApp.get('/test-log', (req, res) => {
    res.status(200).json({ success: true });
  });

  it('should log request details (method, URL, status, response time)', async () => {
    const response = await request(testApp).get('/test-log');

    expect(response.status).toBe(200);
    expect(console.log).toHaveBeenCalledTimes(1);

    const logCall = vi.mocked(console.log).mock.calls[0][0];
    expect(logCall).toContain('GET');
    expect(logCall).toContain('/test-log');
    expect(logCall).toContain('200');
    expect(logCall).toContain('ms');
  });
});
