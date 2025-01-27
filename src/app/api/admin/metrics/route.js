import { NextResponse } from "next/server";
import { connectDB } from '@/lib/database';
import DashboardMetrics from "@/models/DashboardMetrics";

export const dynamic = 'force-dynamic';

// Get metrics with interval and date range filtering
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        
        // Parse query parameters
        const interval = searchParams.get('interval') || 'daily';
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const type = searchParams.get('type'); // For specific metric types

        // Build query
        const query = { interval };
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) query.timestamp.$gte = new Date(startDate);
            if (endDate) query.timestamp.$lte = new Date(endDate);
        }

        // Get latest metrics
        const latest = await DashboardMetrics.findOne(
            { interval },
            {},
            { sort: { timestamp: -1 } }
        );

        // If no metrics exist, create sample data
        if (!latest) {
            const sampleMetrics = generateSampleMetrics(interval);
            await DashboardMetrics.create(sampleMetrics);
            
            return NextResponse.json({
                success: true,
                data: {
                    metrics: [sampleMetrics],
                    latest: sampleMetrics,
                    trends: {}
                }
            });
        }

        // Get previous period data for trends
        const previousPeriodEnd = new Date(latest.timestamp);
        const previousPeriodStart = new Date(latest.timestamp);
        
        switch (interval) {
            case 'realtime':
                previousPeriodStart.setMinutes(previousPeriodStart.getMinutes() - 5);
                break;
            case 'hourly':
                previousPeriodStart.setHours(previousPeriodStart.getHours() - 1);
                break;
            case 'daily':
                previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
                break;
            case 'weekly':
                previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
                break;
            case 'monthly':
                previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
                break;
        }

        const previous = await DashboardMetrics.findOne({
            interval,
            timestamp: {
                $gte: previousPeriodStart,
                $lt: previousPeriodEnd
            }
        });

        // Calculate trends
        const trends = calculateTrends(latest, previous);

        // Get historical data with type filtering
        let projection = {};
        if (type) {
            projection[`metrics.${type}`] = 1;
        }

        const metrics = await DashboardMetrics.find(query, projection)
            .sort({ timestamp: -1 })
            .limit(100);

        return NextResponse.json({
            success: true,
            data: {
                metrics,
                latest,
                trends
            }
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch metrics' },
            { status: 500 }
        );
    }
}

// Record new metrics
export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        
        if (!data.interval) {
            return NextResponse.json(
                { success: false, error: 'Interval is required' },
                { status: 400 }
            );
        }

        // Validate and process the metrics data
        const processedMetrics = await processMetricsData(data.metrics);
        
        const metrics = await DashboardMetrics.create({
            interval: data.interval,
            timestamp: new Date(),
            metrics: processedMetrics
        });

        return NextResponse.json({
            success: true,
            data: metrics
        });
    } catch (error) {
        console.error('Error creating metrics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create metrics' },
            { status: 500 }
        );
    }
}

// Helper function to generate sample metrics
function generateSampleMetrics(interval) {
    return {
        interval,
        timestamp: new Date(),
        metrics: {
            visitors: {
                total: 1250,
                unique: 850,
                returning: 400
            },
            pageViews: {
                total: 3200,
                perVisitor: 2.56,
                popular: [
                    { path: '/blog', views: 800, uniqueViews: 600 },
                    { path: '/projects', views: 600, uniqueViews: 450 },
                    { path: '/services', views: 400, uniqueViews: 300 }
                ]
            },
            engagement: {
                bounceRate: 35.8,
                avgSessionDuration: 185,
                avgTimeOnPage: 120
            },
            performance: {
                loadTime: 0.8,
                serverResponseTime: 0.2,
                errorRate: 0.5
            },
            content: {
                blogs: {
                    total: 25,
                    published: 20,
                    drafts: 5,
                    views: 1200,
                    comments: 45
                },
                projects: {
                    total: 12,
                    active: 5,
                    completed: 7,
                    views: 800
                },
                services: {
                    total: 8,
                    views: 600,
                    inquiries: 15
                }
            },
            geographic: {
                countries: [
                    { code: 'US', visitors: 500, pageViews: 1200 },
                    { code: 'UK', visitors: 300, pageViews: 800 },
                    { code: 'CA', visitors: 200, pageViews: 600 }
                ]
            },
            devices: {
                browsers: [
                    { name: 'Chrome', version: '91+', users: 600 },
                    { name: 'Firefox', version: '89+', users: 300 },
                    { name: 'Safari', version: '14+', users: 200 }
                ],
                os: [
                    { name: 'Windows', version: '10', users: 700 },
                    { name: 'MacOS', version: '11+', users: 300 },
                    { name: 'Linux', version: 'Various', users: 100 }
                ]
            }
        }
    };
}

// Helper function to calculate trends
function calculateTrends(current, previous) {
    if (!previous) return {};

    const calculatePercentageChange = (current, previous) => {
        if (!previous) return 0;
        return ((current - previous) / previous) * 100;
    };

    const trends = {};
    const metricGroups = [
        'visitors',
        'pageViews',
        'engagement',
        'performance',
        'content'
    ];

    for (const group of metricGroups) {
        if (current.metrics?.[group] && previous.metrics?.[group]) {
            trends[group] = {};
            
            // Handle nested objects
            for (const key in current.metrics[group]) {
                if (typeof current.metrics[group][key] === 'number') {
                    trends[group][key] = calculatePercentageChange(
                        current.metrics[group][key],
                        previous.metrics[group][key]
                    );
                } else if (typeof current.metrics[group][key] === 'object') {
                    // Handle nested metrics (e.g., blogs.total, blogs.views)
                    trends[group][key] = {};
                    for (const subKey in current.metrics[group][key]) {
                        if (typeof current.metrics[group][key][subKey] === 'number') {
                            trends[group][key][subKey] = calculatePercentageChange(
                                current.metrics[group][key][subKey],
                                previous.metrics[group][key][subKey]
                            );
                        }
                    }
                }
            }
        }
    }

    return trends;
}

// Helper function to process and validate metrics data
async function processMetricsData(metrics) {
    // Add any necessary data processing or validation here
    return metrics;
} 