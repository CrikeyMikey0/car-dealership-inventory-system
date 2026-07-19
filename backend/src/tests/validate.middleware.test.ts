/**
 * @file validate.middleware.test.ts
 * @description Unit tests for the request validation middleware.
 *
 * Mocks an Express app to verify that `validateBody` correctly parses payloads
 * against a Zod schema. Asserts that valid payloads are assigned to `req.body`
 * and invalid payloads are caught, formatted into `ValidationError` instances,
 * and handled by the global error middleware.
 */

import express from 'express';
import request from 'supertest';
import { z } from 'zod';
import { describe, it, expect } from 'vitest';
import { validateBody } from '../middleware/validate.middleware';
import { errorHandler } from '../middleware/error.middleware';

const testSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().int().min(18, 'Must be at least 18'),
});

const testApp = express();
testApp.use(express.json());

testApp.post('/test-validation', validateBody(testSchema), (req, res) => {
  res.status(200).json({ success: true, data: req.body });
});

testApp.use(errorHandler);

describe('Request Body Validation Middleware', () => {
  it('should call next() and succeed when the request body matches the schema', async () => {
    const validData = {
      username: 'john_doe',
      email: 'john@example.com',
      age: 25,
    };

    const response = await request(testApp)
      .post('/test-validation')
      .send(validData);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: validData,
    });
  });

  it('should return 400 Bad Request with standardized errors list when data is invalid', async () => {
    const invalidData = {
      username: 'jo', // too short
      email: 'invalid-email', // invalid email
      age: 15, // too young
    };

    const response = await request(testApp)
      .post('/test-validation')
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation Error');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        { field: 'username', message: 'Username must be at least 3 characters' },
        { field: 'email', message: 'Invalid email address' },
        { field: 'age', message: 'Must be at least 18' },
      ])
    );
  });

  it('should return 400 Bad Request with missing fields when request body is empty', async () => {
    const response = await request(testApp)
      .post('/test-validation')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        { field: 'username', message: 'Required' },
        { field: 'email', message: 'Required' },
        { field: 'age', message: 'Required' },
      ])
    );
  });
});
