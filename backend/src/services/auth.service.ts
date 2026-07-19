/**
 * @file auth.service.ts
 * @description Business logic for authentication operations.
 *
 * Handles user registration, login, token refresh, and password changes.
 * Delegates data persistence to `UserRepository` and token creation to
 * the JWT service functions.  All sensitive fields (e.g. password hashes)
 * are stripped before data is returned to callers.
 */

import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError } from '../errors/app-error';
import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from '../schemas/auth.schema';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwt.service';
import { z } from 'zod';

// Derive input types from the corresponding Zod schemas so that
// changes to validation rules are automatically reflected here.
type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type RefreshInput = z.infer<typeof refreshSchema>;
type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Service class that encapsulates all authentication business rules.
 */
export class AuthService {
  private userRepository = new UserRepository();

  /**
   * Registers a new user in the system.
   *
   * Validates that the email is unique, hashes the password, creates the
   * database record, and returns the new user without the password hash.
   *
   * @param input - Validated registration payload (name, email, password).
   * @returns The created user object with the password field removed.
   * @throws {AppError} 409 if the email address is already registered.
   */
  async register(input: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await hashPassword(input.password);

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
      role: 'USER', // All self-registered accounts get the default USER role
    });

    // Remove the password hash before returning — never expose it to clients
    const safeUser = { ...user } as Omit<typeof user, 'password'> & { password?: string };
    delete safeUser.password;
    return safeUser;
  }

  /**
   * Authenticates a user with email and password.
   *
   * Verifies that the user exists and that the supplied plain-text password
   * matches the stored hash.  Generates short-lived access and long-lived
   * refresh tokens on success.
   *
   * @param input - Validated login payload (email, password).
   * @returns An object containing `accessToken`, `refreshToken`, and the
   *          authenticated `user` (without the password hash).
   * @throws {AppError} 401 if the email is unknown or the password is wrong.
   *         A generic message is used intentionally to prevent user enumeration.
   */
  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      // Use the same message for wrong email and wrong password to prevent enumeration
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Strip the password hash before including the user in the response
    const safeUser = { ...user } as Omit<typeof user, 'password'> & { password?: string };
    delete safeUser.password;
    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  /**
   * Refreshes a user's access token using a valid refresh token.
   *
   * Verifies the refresh token's signature and expiry, confirms the user
   * still exists in the database, then issues a new access token.
   *
   * @param input - Validated payload containing the refresh token string.
   * @returns An object with a new `accessToken`.
   * @throws {AppError} 401 if the token has expired or is otherwise invalid.
   */
  async refresh(input: RefreshInput) {
    try {
      const decoded = verifyRefreshToken(input.refreshToken);
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new AppError(401, 'User not found');
      }

      const accessToken = generateAccessToken({ userId: user.id, role: user.role });
      return { accessToken };
    } catch (error: unknown) {
      // Propagate our own AppErrors unchanged; convert JWT-specific errors
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AppError(401, 'Refresh token has expired');
      }
      throw new AppError(401, 'Invalid refresh token');
    }
  }

  /**
   * Changes the password for an authenticated user.
   *
   * Confirms the supplied `currentPassword` matches the existing hash before
   * updating to the new hash.  The user record is fetched by ID rather than
   * email so this cannot be exploited by a user supplying a different email.
   *
   * @param userId - The ID of the authenticated user (sourced from `req.user`).
   * @param input - Validated payload with `currentPassword` and `newPassword`.
   * @throws {AppError} 404 if the user cannot be found (e.g. deleted account).
   * @throws {AppError} 400 if the current password does not match.
   */
  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isPasswordValid = await comparePassword(input.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new AppError(400, 'Incorrect current password');
    }

    const newPasswordHash = await hashPassword(input.newPassword);
    await this.userRepository.update(userId, { password: newPasswordHash });
  }
}
