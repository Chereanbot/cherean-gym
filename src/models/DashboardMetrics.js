import mongoose from "mongoose";

const DashboardMetricsSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Date,
            required: true,
            default: Date.now
        },
        interval: {
            type: String,
            enum: ['realtime', 'hourly', 'daily', 'weekly', 'monthly'],
            required: true
        },
        metrics: {
            visitors: {
                total: { type: Number, default: 0 },
                unique: { type: Number, default: 0 },
                returning: { type: Number, default: 0 }
            },
            pageViews: {
                total: { type: Number, default: 0 },
                perVisitor: { type: Number, default: 0 },
                popular: [{
                    path: String,
                    views: Number,
                    uniqueViews: Number
                }]
            },
            engagement: {
                bounceRate: { type: Number, default: 0 },
                avgSessionDuration: { type: Number, default: 0 },
                avgTimeOnPage: { type: Number, default: 0 }
            },
            performance: {
                loadTime: { type: Number, default: 0 },
                serverResponseTime: { type: Number, default: 0 },
                errorRate: { type: Number, default: 0 }
            },
            resources: {
                cpu: { type: Number, default: 0 },
                memory: { type: Number, default: 0 },
                bandwidth: { type: Number, default: 0 }
            },
            content: {
                blogs: {
                    total: { type: Number, default: 0 },
                    published: { type: Number, default: 0 },
                    drafts: { type: Number, default: 0 },
                    views: { type: Number, default: 0 },
                    comments: { type: Number, default: 0 }
                },
                projects: {
                    total: { type: Number, default: 0 },
                    active: { type: Number, default: 0 },
                    completed: { type: Number, default: 0 },
                    views: { type: Number, default: 0 }
                },
                services: {
                    total: { type: Number, default: 0 },
                    views: { type: Number, default: 0 },
                    inquiries: { type: Number, default: 0 }
                },
                messages: {
                    total: { type: Number, default: 0 },
                    unread: { type: Number, default: 0 },
                    responseTime: { type: Number, default: 0 }
                }
            },
            geographic: {
                countries: [{
                    code: String,
                    visitors: Number,
                    pageViews: Number
                }],
                cities: [{
                    name: String,
                    country: String,
                    visitors: Number,
                    pageViews: Number
                }]
            },
            devices: {
                browsers: [{
                    name: String,
                    version: String,
                    users: Number
                }],
                os: [{
                    name: String,
                    version: String,
                    users: Number
                }],
                devices: [{
                    type: String,
                    brand: String,
                    model: String,
                    users: Number
                }]
            }
        }
    },
    { 
        timestamps: true,
        expires: 7776000 // 90 days for non-realtime data
    }
);

// Indexes for better query performance
DashboardMetricsSchema.index({ timestamp: -1 });
DashboardMetricsSchema.index({ interval: 1, timestamp: -1 });
DashboardMetricsSchema.index({ 'metrics.visitors.total': -1 });
DashboardMetricsSchema.index({ 'metrics.pageViews.total': -1 });
DashboardMetricsSchema.index({ 'metrics.engagement.bounceRate': 1 });

// Compound indexes for common queries
DashboardMetricsSchema.index({ interval: 1, 'metrics.visitors.total': -1 });
DashboardMetricsSchema.index({ interval: 1, 'metrics.pageViews.total': -1 });

// Add TTL index for data cleanup (keep data for 90 days)
DashboardMetricsSchema.index({ timestamp: 1 }, { 
    expireAfterSeconds: 90 * 24 * 60 * 60 // 90 days
});

const DashboardMetrics = mongoose.models.DashboardMetrics || mongoose.model("DashboardMetrics", DashboardMetricsSchema);

export default DashboardMetrics; 