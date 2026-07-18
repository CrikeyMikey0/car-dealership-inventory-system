import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import prisma from '../config/database';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';

const app = createApp();

describe('Auth Integration Tests', () => {
  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('User Registration (POST /api/auth/register)', () => {
    const validUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should successfully register a new user and return safe user info', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toBe(validUser.name);
      expect(res.body.data.email).toBe(validUser.email);
      expect(res.body.data.role).toBe('USER');
      expect(res.body.data.password).toBeUndefined(); // Crucial security requirement
      expect(res.body.data.passwordHash).toBeUndefined();
    });

    it('should prevent registration with a duplicate email', async () => {
      // Register first user
      await request(app).post('/api/auth/register').send(validUser);

      // Attempt to register same email again
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: validUser.email,
          password: 'password456',
        });

      expect(res.status).toBe(409); // Conflict
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/exists|duplicate|conflict|registered/i);
    });

    it('should reject registration with invalid request body (Zod validation)', async () => {
      const invalidUser = {
        name: '', // empty name
        email: 'not-an-email', // invalid email format
        password: '123', // password too short
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(res.status).toBe(400); // Bad Request
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
      expect(res.body.errors.length).toBeGreaterThanOrEqual(3);
    });

    it('should reject registration with missing required fields', async () => {
      const incompleteUser = {
        name: 'John Doe',
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('User Login (POST /api/auth/login)', () => {
    const registeredUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    };

    beforeEach(async () => {
      // Register the user first so they exist in DB
      await request(app)
        .post('/api/auth/register')
        .send(registeredUser);
    });

    it('should successfully log in a user and return access/refresh tokens and user info', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredUser.email,
          password: registeredUser.password,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe(registeredUser.email);
      expect(res.body.data.user.password).toBeUndefined();
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredUser.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/credentials|invalid|email|password/i);
    });

    it('should reject login with non-existent user email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: registeredUser.password,
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject login with invalid request body', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Token Refresh (POST /api/auth/refresh)', () => {
    const registeredUser = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    };

    let refreshToken: string;

    beforeEach(async () => {
      // Register user
      await request(app).post('/api/auth/register').send(registeredUser);
      // Log in to get refresh token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: registeredUser.email,
          password: registeredUser.password,
        });
      refreshToken = res.body.data.refreshToken;
    });

    it('should successfully generate a new access token when a valid refresh token is provided', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
    });

    it('should reject access with 401 when the refresh token is expired', async () => {
      // Generate an expired refresh token
      const userRepo = new UserRepository();
      const user = await userRepo.findByEmail(registeredUser.email);
      const expiredRefreshToken = jwt.sign(
        { userId: user!.id },
        env.JWT_REFRESH_SECRET,
        { expiresIn: '-10s' }
      );

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: expiredRefreshToken });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with 401 when the refresh token is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject access with 400 when refreshToken is missing in body', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Change Password (POST /api/auth/change-password)', () => {
    const user = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123',
    };
    let accessToken: string;

    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(user);
      const res = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: user.password,
      });
      accessToken = res.body.data.accessToken;
    });

    it('should successfully change password with valid current password', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify old password no longer works
      const loginResOld = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: 'password123'
      });
      expect(loginResOld.status).toBe(401);

      // Verify new password works
      const loginResNew = await request(app).post('/api/auth/login').send({
        email: user.email,
        password: 'newpassword456'
      });
      expect(loginResNew.status).toBe(200);
    });

    it('should reject change password with incorrect current password', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/incorrect|invalid/i);
    });

    it('should reject change password if unauthenticated', async () => {
      const res = await request(app)
        .post('/api/auth/change-password')
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(401);
    });
  });
});
