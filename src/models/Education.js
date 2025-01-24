import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true
    },
    college: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    achievements: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Education = mongoose.models.Education || mongoose.model("Education", educationSchema);

export default Education;