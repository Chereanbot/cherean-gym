import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    activeUsers: { type: Number, default: 0 },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    avgSessionDuration: { type: Number, default: 0 }, // in seconds
    bounceRate: { type: Number, default: 0 }, // percentage
    errorRate: { type: Number, default: 0 }, // percentage
    serverErrors: { type: Number, default: 0 },
    clientErrors: { type: Number, default: 0 },
    resourceUsage: {
        cpu: { type: Number, default: 0 }, // percentage
        memory: { type: Number, default: 0 }, // percentage
        bandwidth: { type: Number, default: 0 } // MB/s
    },
    apiLatency: { type: Number, default: 0 }, // milliseconds
    uptime: { type: Number, default: 100 }, // percentage
    deviceType: {
        type: String,
        enum: ['desktop', 'mobile', 'tablet'],
        required: true
    },
    country: { type: String, required: true },
    countryCode: { type: String, required: true },
    visitors: { type: Number, default: 1 }
}, {
    timestamps: true
});

// Create indexes for better query performance
AnalyticsSchema.index({ timestamp: -1 });
AnalyticsSchema.index({ deviceType: 1 });
AnalyticsSchema.index({ country: 1 });
AnalyticsSchema.index({ countryCode: 1 });

export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema); 