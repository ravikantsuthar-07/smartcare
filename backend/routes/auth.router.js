import express from 'express';
import {
    registerAuthController,
    sendOTPAuthController,
    verifyOTPAuthController
} from '../controller/auth.controller.js';

const router = express.Router();

router.post('/register', registerAuthController);
router.post('/verify', verifyOTPAuthController);
router.post('/send', sendOTPAuthController);
router.get('/test', (req, res) => {
    res.json({ message: "Auth route is working!" });
});

export default router;