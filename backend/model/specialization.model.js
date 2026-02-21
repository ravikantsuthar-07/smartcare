import mongoose from 'mongoose';

const specaializationSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const specailizationModel = mongoose.model('Specailization', specaializationSchema);

export default specailizationModel;