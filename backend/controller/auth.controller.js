import { authRole } from "../constant/auth.constant.js";
import authModel from "../model/auth.model.js";
import jwt from 'jsonwebtoken';
import { sendOTPviaFast2SMS } from "../services/sms.service.js";

export const registerAuthController = async (req, res) => {
    try {
        const { mode } = req.query;
        const { name, email, mobile, specaialization, registerNumber, age, gender } = req.body;

        if (!name) return res.status(400).json({ success: false, message: 'Name is Required!..' });
        if (!email) return res.status(400).json({ success: false, message: 'Email is Required!..' });
        if (!mobile) return res.status(400).json({ success: false, message: 'Mobile Number is Required!..' });

        const existUser = await authModel.findOne({
            $or: [{ email }, { mobile }]
        });

        if (existUser) return res.status(401).json({ success: false, message: 'User Already Exist' });

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        let registerData = {
            name,
            email,
            mobile,
            otp,
            otpExpire
        };

        if (mode === 'doctor') {
            if (!specaialization) return res.status(400).json({ success: false, message: 'Specalizations is Required!..' });
            if (!registerNumber) return res.status(400).json({ success: false, message: 'Register Number is Required!..' });

            const image = req.file;

            registerData = {
                ...registerData,
                specaialization,
                registerNumber,
                CertificationUrl: image?.filename,
                roles: authRole.DOCTOR
            };
        }

        if (mode === 'user') {
            if (!age) return res.status(400).json({ success: false, message: 'Patient Age is Required!..' });
            if (!gender) return res.status(400).json({ success: false, message: 'Patient Gender is Required!..' });

            registerData = {
                ...registerData,
                age,
                gender,
                roles: authRole.PATIENTS
            };
        }

        if (mode === 'admin') {
            registerData.roles = authRole.ADMIN;
        }
        const user = await authModel.create(registerData);
        console.log(user);

        await sendOTPviaFast2SMS(mobile, otp);

        return res.status(201).json({
            success: true,
            message: 'OTP sent successfully',
            userId: user._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyOTPAuthController = async (req, res) => {
    try {
        const { mobile, otp } = req.body;
        if (!mobile) return res.status(404).json({ success: false, message: 'Mobile Number is Required!..' });
        if (!otp) return res.status(404).json({ success: false, message: 'OTP is Required!..' });

        const auth = await authModel.findOne({ mobile });
        if (!auth) return res.status(404).json({ success: false, message: 'User not found' });

        if (auth.otp != otp) return res.status(419).json({ success: false, message: 'OTP is Invaild!..' });
        if (auth.otpExpire < new Date()) return res.status(419).json({ success: false, message: 'OTP is Expired!..' });
        const token = jwt.sign({ _id: auth._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });
        return res.status(200).json({
            success: true,
            message: 'OTP Verifly Successfully',
            token,
            auth
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}

export const sendOTPAuthController = async (req, res) => {
    try {
        const { mobile } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        const auth = await authModel.findOneAndUpdate({ mobile }, { otp, otpExpire }, { new: true });
        if (!auth) {
            return res.status(404).json({
                success: false,
                message: 'This Number is Not Register'
            });
        }
        await sendOTPviaFast2SMS(mobile, otp);
        return res.status(200).json({
            success: true,
            message: 'OTP Send Successfully',
            auth
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}