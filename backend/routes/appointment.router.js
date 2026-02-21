import express from 'express';
import { isAdmin, isDoctor, isUser, requireSignIn } from '../middleware/auth.middleware.js';
import {
    getListAppointmentController,
    gettingAppointmentController,
    sendAppointmentController
} from '../controller/appointment.controller.js';

const router = express.Router();

router.post(`/send`, requireSignIn, isUser, sendAppointmentController);
router.get(`/get`, requireSignIn, isUser, gettingAppointmentController);
router.get(`/list`, requireSignIn, isAdmin, getListAppointmentController);
router.get(`/getDoctor`, requireSignIn, isDoctor, gettingAppointmentController);

export default router;