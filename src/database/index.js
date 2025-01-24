import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return true;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully");
        return true;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return false;
    }
}; 