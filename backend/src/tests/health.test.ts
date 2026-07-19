/**
 * @file health.test.ts
 * @description Integration test for the application health check endpoint.
 *
 * Verifies that the `/api/health` route is accessible and returns a 200 OK status
 * with the correct JSON payload indicating server uptime.
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

describe('GET /health', () => {
  it('should return 200 OK and a healthy status message at /health', async () => {
    const app = createApp();
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.database).toBe('connected');
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.version).toBe('1.0.0');
  });

  it('should return 200 OK and a healthy status message at /api/health', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
    expect(response.body.database).toBe('connected');
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.version).toBe('1.0.0');
  });
});
