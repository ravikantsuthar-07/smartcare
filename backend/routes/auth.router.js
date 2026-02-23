import express from 'express';
import {
    gettingAuthController,
    gettingDoctorAuthController,
    registerAuthController,
    sendOTPAuthController,
    updateAuthController,
    verifyOTPAuthController
} from '../controller/auth.controller.js';
// import { upload } from '../middleware/upload.js';
import { isAdmin, isUser, requireSignIn } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerAuthController);
router.post('/verify', verifyOTPAuthController);
router.post('/send', sendOTPAuthController);
router.put(`/update/:id`, requireSignIn, isAdmin, updateAuthController);
router.get(`/get`, requireSignIn, isAdmin, gettingAuthController);
router.get(`/getDoctor`, requireSignIn, isUser, gettingDoctorAuthController);
router.get('/test', (req, res) => {
    res.json({ message: "Auth route is working!" });
});

export default router;