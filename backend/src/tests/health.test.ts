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

describe('GET /api/health', () => {
  it('should return 200 OK and a success status message', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: 'Server is running',
    });
  });
});
