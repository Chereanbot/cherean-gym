import mongoose from "mongoose";

const DashboardActivitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['blog', 'project', 'service', 'message', 'system'],
            required: true
        },
        action: {
            type: String,
            enum: ['create', 'update', 'delete', 'publish', 'unpublish', 'login', 'settings', 'error'],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: String,
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ip: String,
        userAgent: String,
        status: {
            type: String,
            enum: ['success', 'warning', 'error'],
            default: 'success'
        },
        importance: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        }
    },
    { 
        timestamps: true,
        expires: 604800 // Automatically delete documents after 7 days
    }
);

// Indexes for better query performance
DashboardActivitySchema.index({ createdAt: -1 });
DashboardActivitySchema.index({ type: 1, createdAt: -1 });
DashboardActivitySchema.index({ action: 1, createdAt: -1 });
DashboardActivitySchema.index({ status: 1, createdAt: -1 });
DashboardActivitySchema.index({ importance: 1, createdAt: -1 });

const DashboardActivity = mongoose.models.DashboardActivity || mongoose.model("DashboardActivity", DashboardActivitySchema);

export default DashboardActivity; 