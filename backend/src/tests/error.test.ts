import express from 'express';
import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { AppError } from '../errors/app-error';
import { errorHandler, notFoundHandler } from '../middleware/error.middleware';
import { asyncHandler } from '../utils/async-handler';

// Create a mock Express application to test the error middleware in isolation
const testApp = express();

testApp.get('/test-app-error', (_req, _res) => {
  throw new AppError(400, 'Custom bad request error');
});

testApp.get('/test-async-error', asyncHandler(async (_req, _res) => {
  throw new Error('Unhandled async database error');
}));

testApp.get('/test-ok', (_req, res) => {
  res.status(200).json({ success: true });
});

// Register 404 handler first, then global error handler
testApp.all('*', notFoundHandler);
testApp.use(errorHandler);

describe('Centralized Error Handling', () => {
  it('should return 404 when route does not exist', async () => {
    const response = await request(testApp).get('/non-existent-route');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Route /non-existent-route not found');
    expect(response.body.stack).toBeDefined();
  });

  it('should return status from AppError and format JSON message', async () => {
    const response = await request(testApp).get('/test-app-error');
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Custom bad request error');
    expect(response.body.stack).toBeDefined();
  });

  it('should return 500 status and generic error message for unhandled errors', async () => {
    const response = await request(testApp).get('/test-async-error');
    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Internal server error');
    expect(response.body.stack).toBeDefined();
  });

  it('should hide stack trace when NODE_ENV is production', async () => {
    // Temporarily mock NODE_ENV
    vi.stubEnv('NODE_ENV', 'production');

    const response = await request(testApp).get('/test-async-error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: 'Internal server error',
    });
    expect(response.body.stack).toBeUndefined();

    // Clean up stub
    vi.unstubAllEnvs();
  });
});
