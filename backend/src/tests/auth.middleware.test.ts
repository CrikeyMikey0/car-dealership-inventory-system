// Integration tests for authentication and authorization middleware
import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { User } from '@prisma/client';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { generateAccessToken } from '../services/jwt.service';
import prisma from '../config/database';
import { errorHandler } from '../middleware/error.middleware';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

describe('Auth Middleware', () => {
  let testApp: express.Express;
  let testUser: User;
  let testAdmin: User;

  beforeEach(async () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);

    // Create test users in database
    testUser = await prisma.user.create({
      data: {
        name: 'Normal User',
        email: `user_${timestamp}_${random}@example.com`,
        password: 'hashedpassword',
        role: 'USER',
      },
    });

    testAdmin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: `admin_${timestamp}_${random}@example.com`,
        password: 'hashedpassword',
        role: 'ADMIN',
      },
    });

    // Set up dummy test app
    testApp = express();
    testApp.use(express.json());

    // Public dummy route
    testApp.get('/public', (req, res) => res.json({ message: 'public' }));

    // Protected dummy route
    testApp.get('/protected', authenticate, (req, res) => {
      res.json({ success: true, user: req.user });
    });

    // Admin-only dummy route
    testApp.get('/admin-only', authenticate, authorize('ADMIN'), (req, res) => {
      res.json({ success: true, message: 'admin accessed' });
    });

    // User-only dummy route
    testApp.get('/user-only', authenticate, authorize('USER'), (req, res) => {
      res.json({ success: true, message: 'user accessed' });
    });

    // Apply error handler middleware
    testApp.use(errorHandler);
  });

  describe('Authentication Middleware (authenticate)', () => {
    it('should allow access and attach user to request when a valid Bearer token is provided', async () => {
      const token = generateAccessToken({ userId: testUser.id, role: testUser.role });
      
      const res = await request(testApp)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.password).toBeUndefined();
    });

    it('should reject access with 401 when Authorization header is missing', async () => {
      const res = await request(testApp).get('/protected');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token|auth/i);
    });

    it('should reject access with 401 when Authorization header is not Bearer type', async () => {
      const res = await request(testApp)
        .get('/protected')
        .set('Authorization', 'Basic dummytoken');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with 401 when the token is invalid/malformed', async () => {
      const res = await request(testApp)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with 401 when the token is expired', async () => {
      // Create a token that is expired by signing it with -10s expiration
      const expiredToken = jwt.sign(
        { userId: testUser.id, role: testUser.role },
        env.JWT_SECRET,
        { expiresIn: '-10s' }
      );

      const res = await request(testApp)
        .get('/protected')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Authorization Middleware (authorize)', () => {
    it('should allow access to admin route for user with ADMIN role', async () => {
      const token = generateAccessToken({ userId: testAdmin.id, role: testAdmin.role });

      const res = await request(testApp)
        .get('/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject access to admin route for user with USER role with 403 Forbidden', async () => {
      const token = generateAccessToken({ userId: testUser.id, role: testUser.role });

      const res = await request(testApp)
        .get('/admin-only')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/forbidden|permission|role/i);
    });

    it('should allow access to user route for user with USER role', async () => {
      const token = generateAccessToken({ userId: testUser.id, role: testUser.role });

      const res = await request(testApp)
        .get('/user-only')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
