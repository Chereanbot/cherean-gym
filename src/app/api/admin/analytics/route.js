import { connectDB } from '@/lib/database';
import { Analytics } from '@/models/Analytics';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Try to connect to the database
        const isConnected = await connectDB();
        if (!isConnected) {
            console.error('Failed to connect to database');
            return Response.json(
                { success: false, error: 'Database connection failed' },
                { status: 500 }
            );
        }

        const headersList = headers();
        const timeRange = headersList.get('x-time-range') || '24h';

        // Return mock data for testing
        const mockData = {
            visitors: {
                activeNow: 5,
                total: 150,
                unique: 100,
                returning: 50,
                newUsers: 50,
                history: Array.from({ length: 24 }, (_, i) => ({
                    timestamp: new Date(Date.now() - i * 3600000),
                    total: Math.floor(Math.random() * 20) + 10
                }))
            },
            pageViews: {
                total: 300
            },
            engagement: {
                avgSessionDuration: 300,
                bounceRate: 45
            },
            performance: {
                errorRate: 0.5,
                serverErrors: 2,
                clientErrors: 5,
                resourceUsage: {
                    cpu: 35,
                    memory: 45,
                    bandwidth: 2.5
                },
                apiLatency: 85,
                uptime: 99.9,
                history: Array.from({ length: 24 }, (_, i) => ({
                    timestamp: new Date(Date.now() - i * 3600000),
                    serverResponseTime: Math.floor(Math.random() * 50) + 50,
                    errorRate: Math.random() * 1,
                    cpu: Math.floor(Math.random() * 30) + 20,
                    memory: Math.floor(Math.random() * 30) + 30,
                    bandwidth: Math.random() * 3 + 1
                })),
                errorHistory: Array.from({ length: 24 }, (_, i) => ({
                    timestamp: new Date(Date.now() - i * 3600000),
                    serverErrors: Math.floor(Math.random() * 2),
                    clientErrors: Math.floor(Math.random() * 3)
                }))
            },
            devices: {
                devices: [
                    { type: 'desktop', share: 65 },
                    { type: 'mobile', share: 30 },
                    { type: 'tablet', share: 5 }
                ]
            },
            geographic: {
                countries: [
                    { name: 'United States', code: 'US', visitors: 50 },
                    { name: 'United Kingdom', code: 'GB', visitors: 20 },
                    { name: 'Germany', code: 'DE', visitors: 15 },
                    { name: 'France', code: 'FR', visitors: 10 },
                    { name: 'Canada', code: 'CA', visitors: 5 }
                ]
            }
        };

        return Response.json({ success: true, data: mockData });

    } catch (error) {
        console.error('Analytics Error:', error.message);
        console.error('Error stack:', error.stack);
        return Response.json(
            { 
                success: false, 
                error: 'Failed to fetch analytics data',
                details: error.message
            },
            { status: 500 }
        );
    }
} 