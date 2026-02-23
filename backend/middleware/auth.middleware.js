import { authRole } from "../constant/auth.constant.js";
import authModel from "../model/auth.model.js";
import jwt from 'jsonwebtoken';

export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token)
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded._id)
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const isUser = async (req, res, next) => {
    const user = await authModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User is Not Found!..' })
    if (user.roles !== authRole.PATIENTS) return res.status(403).json({ success: false, message: 'Access denied, user only' });
    next();
};

export const isAdmin = async (req, res, next) => {
    const user = await authModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User is Not Found!..' })
    if (user.roles !== authRole.ADMIN) return res.status(403).json({ success: false, message: 'Access denied, user only' });
    next();
};

export const isDoctor = async (req, res, next) => {
    const user = await authModel.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User is Not Found!..' })
    if (user.roles !== authRole.DOCTOR) return res.status(403).json({ success: false, message: 'Access denied, user only' });
    next();
};