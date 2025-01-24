import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
    position: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    jobprofile: {
        type: String,
        required: true
    },
    skills: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Experience = mongoose.models.Experience || mongoose.model("Experience", experienceSchema);

export default Experience;