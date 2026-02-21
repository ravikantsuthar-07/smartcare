import express from 'express';
import authRoutes from './auth.router.js';
import appointmentRoutes from './appointment.router.js';
import specailizationRoutes from './specaialization.router.js';

const router = express.Router();

router.use(`/auth`, authRoutes);
router.use(`/appointment`, appointmentRoutes);
router.use(`/specialization`, specailizationRoutes);

export default router;