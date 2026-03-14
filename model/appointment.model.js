import mongoose from 'mongoose';
import { appointmentStatus } from '../constant/appointment.constant.js';

const appointmentSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [appointmentStatus.PENDING, appointmentStatus.CONFIRMED, appointmentStatus.CANCELLED],
        default: appointmentStatus.PENDING
    }
}, { timestamps: true });

const appointmentModel = mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;