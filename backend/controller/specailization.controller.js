import specailizationModel from "../model/specialization.model.js";

export const addSpecailizationController = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Name is Required!..' });

        const specailization = await specailizationModel.create({ name, description, isActive });
        return res.status(201).json({
            success: true,
            message: 'Specailization created successfully',
            specailization
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}

export const getSpecailizationController = async (req, res) => {
    try {
        const specailization = await specailizationModel.find();
        return res.status(200).json({
            success: true,
            message: 'Specailization fetched successfully',
            specailization
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}

export const updateSpecailizationController = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (isActive.type === 'boolean') updateData.isActive = isActive;
        const specailization = await specailizationModel.findByIdAndUpdate(req.params.id, updateData, { new: true, upsert: false });
        if (!specailization) return res.status(404).json({ success: false, message: 'Specailization not found' });
        return res.status(200).json({
            success: true,
            message: 'Specailization updated successfully',
            specailization
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        });
    }
}

export const deleteSpecailizationController = async (req, res) => {
    try {
        const specailization = await specailizationModel.findByIdAndDelete(req.params.id);
        if (!specailization) return res.status(404).json({ success: false, message: 'Specailization not found' });
        return res.status(200).json({
            success: true,
            message: 'Specailization deleted successfully',
            specailization
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}

export const gettingListSpecailizationController = async (req, res) => {
    try {
        const specailization = await specailizationModel.find({ isActive: true });
        return res.status(200).json({
            success: true,
            message: 'specailization Fetched Successfully',
            specailization
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            error
        })
    }
}