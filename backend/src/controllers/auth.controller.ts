import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService = new AuthService();

  /**
   * Handles POST /api/auth/register request.
   */
  register = async (req: Request, res: Response): Promise<void> => {
    const safeUser = await this.authService.register(req.body);
    
    res.status(201).json({
      success: true,
      data: safeUser,
    });
  };

  /**
   * Handles POST /api/auth/login request.
   */
  login = async (req: Request, res: Response): Promise<void> => {
    const loginResult = await this.authService.login(req.body);

    res.status(200).json({
      success: true,
      data: loginResult,
    });
  };

  /**
   * Handles POST /api/auth/refresh request.
   */
  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshResult = await this.authService.refresh(req.body);

    res.status(200).json({
      success: true,
      data: refreshResult,
    });
  };
}
