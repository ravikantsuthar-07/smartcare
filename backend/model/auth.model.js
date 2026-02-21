import mongoose from 'mongoose';
import { authGender, authRole } from '../constant/auth.constant.js';

const authSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: Number,
        enum: [authGender.MALE, authGender.FEMALE, authGender.OTHER],
        required: true,
    },
    specaialization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Specailization'
    },
    registerNumber: {
        type: String
    },
    CertificationUrl: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
    roles: {
        type: Number,
        enum: [authRole.ADMIN, authRole.DOCTOR, authRole.PATIENTS],
        default: authRole.PATIENTS
    },
    otp: {
        type: Number,
        default: null
    },
    otpExpire: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const authModel = mongoose.model('Auth', authSchema);

export default authModel;