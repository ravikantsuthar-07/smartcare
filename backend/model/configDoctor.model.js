import mongoose from 'mongoose';
import { configDoctorKey } from '../constant/configDoctor.constant.js';

const configDoctorSchema = mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    key: {
        type: Number,
        enum: [
            configDoctorKey.QUALIFICATION,
            configDoctorKey.YEAROFJOINING,
            configDoctorKey.CONSULTANCYFEES,
            configDoctorKey.BIO,
            configDoctorKey.ADDRESS,
            configDoctorKey.SUNDAYAVAILABILITY,
            configDoctorKey.MONDAYAVAILABILITY,
            configDoctorKey.TUESDAYAVAILABILITY,
            configDoctorKey.WEDNESDAYAVAILABILITY,
            configDoctorKey.THURSDAYAVAILABILITY,
            configDoctorKey.FRIDAYAVAILABILITY,
            configDoctorKey.SATURDAYAVAILABILITY
        ],
        required: true
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, { timestamps: true });

const configDoctorModel = mongoose.model('ConfigDoctor', configDoctorSchema);

export default configDoctorModel;