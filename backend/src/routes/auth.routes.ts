import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { registerSchema, loginSchema, refreshSchema, changePasswordSchema } from '../schemas/auth.schema';
import { asyncHandler } from '../utils/async-handler';

const router = Router();
const controller = new AuthController();

router.post(
  '/register',
  validateBody(registerSchema),
  asyncHandler(controller.register)
);

router.post(
  '/login',
  validateBody(loginSchema),
  asyncHandler(controller.login)
);

router.post(
  '/refresh',
  validateBody(refreshSchema),
  asyncHandler(controller.refresh)
);

router.post(
  '/change-password',
  authenticate,
  validateBody(changePasswordSchema),
  asyncHandler(controller.changePassword)
);

export default router;
