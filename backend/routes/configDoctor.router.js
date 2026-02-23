import express  from 'express';
import { isDoctor, requireSignIn } from '../middleware/auth.middleware.js';
import { getDoctorConfigController, updateConfigDoctorController } from '../controller/configDoctor.controller.js';

const router = express.Router();

router.post(`/update`, requireSignIn, isDoctor, updateConfigDoctorController);
router.get(`/get/:id`, getDoctorConfigController);

export default router;