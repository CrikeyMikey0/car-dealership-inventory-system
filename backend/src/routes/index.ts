import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import vehicleRouter from './vehicle.routes';

const router = Router();

router.use(healthRouter);
router.use('/auth', authRouter);
router.use('/vehicles', vehicleRouter);

export default router;
