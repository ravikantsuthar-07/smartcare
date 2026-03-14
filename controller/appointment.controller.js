import appointmentModel from "../model/appointment.model.js";

export const sendAppointmentController = async (req, res) => {
    try {
        const {doctor, date, time} = req.body;
        const patient = req.user._id;
        if (!doctor) return res.status(400).json({ success: false, message: 'Doctor is Required!..' });
        if (!date) return res.status(400).json({ success: false, message: 'Date is Required!..' });
        if (!time) return res.status(400).json({ success: false, message: 'Time is Required!..' });

        const appointment = await appointmentModel.create({
            patient,
            doctor,
            date,
            time
        });
        return res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            appointment
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}

export const gettingAppointmentController = async (req, res) => {
    try {
        const patient = req.user._id;
        const appointments = await appointmentModel.find({ patient });
        return res.status(200).json({
            success: true,
            message: 'Appointments fetched successfully',
            appointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}

export const getListAppointmentController = async (req, res) => {
    try {
        const appointments = await appointmentModel.find();
        return res.status(200).json({
            success: true,
            message: 'Appointments fetched successfully',
            appointments
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}