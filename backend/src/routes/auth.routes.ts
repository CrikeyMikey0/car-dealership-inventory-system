import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../schemas/auth.schema';
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

export default router;
