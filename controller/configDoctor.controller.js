import configDoctorModel from "../model/configDoctor.model.js";

export const updateConfigDoctorController = async (req, res) => {
    try {
        const { key, value } = req.body;
        if (!key) return res.status(400).json({ success: false, message: 'Key is Required!..' });
        if (!value) return res.status(400).json({ success: false, message: 'Value is Required!..' });
        const configDoctor = await configDoctorModel.findOneAndUpdate({
            doctor: req.user._id,
            key
        }, { value }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'ConfigDoctor updated successfully',
            configDoctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
};

export const getDoctorConfigController = async (req, res) => {
    try {
        const { doctor } = req.query;
        const configDoctor = await configDoctorModel.find({ doctor });
        return res.status(200).json({
            success: true,
            message: 'ConfigDoctor fetched successfully',
            configDoctor
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}