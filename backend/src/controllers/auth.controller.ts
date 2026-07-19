/**
 * @file auth.controller.ts
 * @description HTTP controller for authentication-related endpoints.
 *
 * Each method extracts the validated request body (already parsed and
 * sanitised by the `validateBody` middleware) and delegates business logic
 * to `AuthService`.  Controllers are intentionally kept thin — they
 * translate between HTTP and the service layer only.
 *
 * Routes that use these handlers:
 *  - POST /api/auth/register
 *  - POST /api/auth/login
 *  - POST /api/auth/refresh
 *  - POST /api/auth/change-password  (requires authentication)
 */

import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

/**
 * Controller class for authentication operations.
 *
 * Instantiates a single `AuthService` per controller instance and
 * exposes arrow-function handlers so they retain the correct `this`
 * context when passed directly to `asyncHandler()`.
 */
export class AuthController {
  private authService = new AuthService();

  /**
   * Handles POST /api/auth/register.
   *
   * Registers a new user account.  Returns the newly created user object
   * (without the password hash) with HTTP 201 Created.
   */
  register = async (req: Request, res: Response): Promise<void> => {
    const safeUser = await this.authService.register(req.body);
    
    res.status(201).json({
      success: true,
      data: safeUser,
    });
  };

  /**
   * Handles POST /api/auth/login.
   *
   * Authenticates a user with email and password.  Returns access and
   * refresh tokens along with the authenticated user object.
   */
  login = async (req: Request, res: Response): Promise<void> => {
    const loginResult = await this.authService.login(req.body);

    res.status(200).json({
      success: true,
      data: loginResult,
    });
  };

  /**
   * Handles POST /api/auth/refresh.
   *
   * Issues a new access token using a valid refresh token.  Does not
   * require the `authenticate` middleware — the refresh token is the
   * credential being validated here.
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshResult = await this.authService.refresh(req.body);

    res.status(200).json({
      success: true,
      data: refreshResult,
    });
  };

  /**
   * Handles POST /api/auth/change-password.
   *
   * Changes the authenticated user's password.  Requires the `authenticate`
   * middleware to have already populated `req.user` with the caller's identity.
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    // req.user is guaranteed to be set by the authenticate middleware
    const userId = req.user!.id;
    await this.authService.changePassword(userId, req.body);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  };
}
