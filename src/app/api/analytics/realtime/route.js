import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import DashboardMetrics from '@/models/DashboardMetrics';

export const dynamic = 'force-dynamic';

// Keep a rolling window of error history
const ERROR_HISTORY_LIMIT = 100;
const METRICS_HISTORY_LIMIT = 60; // 1 hour of minute-by-minute data

export async function GET() {
    try {
        await connectDB();

        // Get the latest metrics
        const latestMetrics = await DashboardMetrics.findOne()
            .sort({ timestamp: -1 })
            .select('metrics timestamp');

        if (!latestMetrics) {
            // Create initial metrics if none exist
            const initialMetrics = await DashboardMetrics.create({
                timestamp: new Date(),
                interval: 'realtime',
                metrics: {
                    visitors: {
                        total: 0,
                        unique: 0,
                        returning: 0,
                        newUsers: 0,
                        activeNow: 0,
                        history: []
                    },
                    pageViews: {
                        total: 0,
                        perVisitor: 0,
                        popular: [],
                        exitPages: []
                    },
                    engagement: {
                        bounceRate: 0,
                        avgSessionDuration: 0,
                        avgTimeOnPage: 0,
                        interactions: 0,
                        scrollDepth: 0
                    },
                    performance: {
                        loadTime: 0,
                        serverResponseTime: 0,
                        errorRate: 0,
                        uptime: 100,
                        apiLatency: 0,
                        serverErrors: 0,
                        clientErrors: 0,
                        history: [],
                        errorHistory: [],
                        resourceUsage: {
                            cpu: 0,
                            memory: 0,
                            bandwidth: 0
                        }
                    }
                }
            });

            return NextResponse.json({
                success: true,
                data: initialMetrics.metrics
            });
        }

        // Get historical data for trends and charts
        const historicalMetrics = await DashboardMetrics.find({
            timestamp: {
                $gte: new Date(Date.now() - 60 * 60 * 1000) // Last hour
            }
        })
        .sort({ timestamp: -1 })
        .limit(METRICS_HISTORY_LIMIT)
        .select('metrics timestamp');

        // Calculate trends
        const hourAgoMetrics = historicalMetrics[historicalMetrics.length - 1];
        
        const trends = hourAgoMetrics ? {
            visitors: calculateTrend(
                latestMetrics.metrics.visitors.total,
                hourAgoMetrics.metrics.visitors.total
            ),
            pageViews: calculateTrend(
                latestMetrics.metrics.pageViews.total,
                hourAgoMetrics.metrics.pageViews.total
            ),
            engagement: calculateTrend(
                latestMetrics.metrics.engagement.avgSessionDuration,
                hourAgoMetrics.metrics.engagement.avgSessionDuration
            ),
            performance: calculateTrend(
                latestMetrics.metrics.performance.errorRate,
                hourAgoMetrics.metrics.performance.errorRate
            )
        } : null;

        // Process historical data for charts
        const processedHistory = historicalMetrics.map(metric => ({
            timestamp: metric.timestamp,
            visitors: metric.metrics.visitors.total,
            pageViews: metric.metrics.pageViews.total,
            serverResponseTime: metric.metrics.performance.serverResponseTime,
            errorRate: metric.metrics.performance.errorRate,
            cpu: metric.metrics.performance.resourceUsage.cpu,
            memory: metric.metrics.performance.resourceUsage.memory,
            bandwidth: metric.metrics.performance.resourceUsage.bandwidth
        })).reverse();

        // Get error history
        const errorHistory = await DashboardMetrics.find({
            'metrics.performance.errorRate': { $gt: 0 }
        })
        .sort({ timestamp: -1 })
        .limit(ERROR_HISTORY_LIMIT)
        .select('metrics.performance timestamp');

        const processedErrorHistory = errorHistory.map(entry => ({
            timestamp: entry.timestamp,
            serverErrors: entry.metrics.performance.serverErrors,
            clientErrors: entry.metrics.performance.clientErrors,
            errorRate: entry.metrics.performance.errorRate
        })).reverse();

        return NextResponse.json({
            success: true,
            data: {
                ...latestMetrics.metrics,
                trends,
                history: processedHistory,
                errorHistory: processedErrorHistory
            }
        });
    } catch (error) {
        console.error('Error fetching real-time metrics:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch real-time metrics'
        }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();

        // Validate the incoming metrics data
        if (!data || typeof data !== 'object') {
            return NextResponse.json({
                success: false,
                error: 'Invalid metrics data'
            }, { status: 400 });
        }

        // Calculate error rates and counts
        const totalErrors = (data.performance?.serverErrors || 0) + (data.performance?.clientErrors || 0);
        const totalRequests = data.pageViews?.total || 1; // Prevent division by zero
        const errorRate = (totalErrors / totalRequests) * 100;

        // Create a new metrics record
        const newMetrics = await DashboardMetrics.create({
            timestamp: new Date(),
            interval: 'realtime',
            metrics: {
                visitors: {
                    total: data.visitors?.total || 0,
                    unique: data.visitors?.unique || 0,
                    returning: data.visitors?.returning || 0,
                    newUsers: data.visitors?.newUsers || 0,
                    activeNow: data.visitors?.activeNow || 0
                },
                pageViews: {
                    total: data.pageViews?.total || 0,
                    perVisitor: data.pageViews?.perVisitor || 0,
                    popular: data.pageViews?.popular || [],
                    exitPages: data.pageViews?.exitPages || []
                },
                engagement: {
                    bounceRate: data.engagement?.bounceRate || 0,
                    avgSessionDuration: data.engagement?.avgSessionDuration || 0,
                    avgTimeOnPage: data.engagement?.avgTimeOnPage || 0,
                    interactions: data.engagement?.interactions || 0,
                    scrollDepth: data.engagement?.scrollDepth || 0
                },
                performance: {
                    loadTime: data.performance?.loadTime || 0,
                    serverResponseTime: data.performance?.serverResponseTime || 0,
                    errorRate: errorRate,
                    serverErrors: data.performance?.serverErrors || 0,
                    clientErrors: data.performance?.clientErrors || 0,
                    uptime: data.performance?.uptime || 100,
                    apiLatency: data.performance?.apiLatency || 0,
                    resourceUsage: {
                        cpu: data.performance?.resourceUsage?.cpu || 0,
                        memory: data.performance?.resourceUsage?.memory || 0,
                        bandwidth: data.performance?.resourceUsage?.bandwidth || 0
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: newMetrics.metrics
        });
    } catch (error) {
        console.error('Error updating real-time metrics:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to update real-time metrics'
        }, { status: 500 });
    }
}

function calculateTrend(current, previous) {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
} 