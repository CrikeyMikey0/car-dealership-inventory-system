import { UserRepository } from '../repositories/user.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError } from '../errors/app-error';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './jwt.service';
import { z } from 'zod';

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;
type RefreshInput = z.infer<typeof refreshSchema>;

export class AuthService {
  private userRepository = new UserRepository();

  /**
   * Registers a new user in the system.
   * Throws a 409 Conflict error if the email is already registered.
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
      role: 'USER', // Default role
    });

    const safeUser = { ...user } as Omit<typeof user, 'password'> & { password?: string };
    delete safeUser.password;
    return safeUser;
  }

  /**
   * Authenticates a user with email and password.
   * Generates and returns JWT access and refresh tokens.
   */
  async login(input: LoginInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isPasswordValid = await comparePassword(input.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken({ userId: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id });

    const safeUser = { ...user } as Omit<typeof user, 'password'> & { password?: string };
    delete safeUser.password;
    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  /**
   * Refreshes user access token using a valid refresh token.
   * Throws 401 Unauthorized if token is expired or invalid.
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
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new AppError(401, 'Refresh token has expired');
      }
      throw new AppError(401, 'Invalid refresh token');
    }
  }
}
