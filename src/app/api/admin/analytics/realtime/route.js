import { headers } from 'next/headers';
import { connectDB } from '@/lib/database';
import { Analytics } from '@/models/Analytics';

export const dynamic = 'force-dynamic';

export async function GET() {
    const headersList = headers();

    // Set headers for SSE
    const responseHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    };

    try {
        await connectDB();

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const sendMetrics = async () => {
                    try {
                        // Get real-time metrics for the last minute
                        const lastMinute = new Date(Date.now() - 60000);
                        
                        // Get current active users and metrics
                        const realtimeMetrics = await Analytics.aggregate([
                            {
                                $match: {
                                    timestamp: { $gte: lastMinute }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    activeUsers: { $sum: '$activeUsers' },
                                    pageViews: { $sum: '$pageViews' },
                                    errorRate: { $avg: '$errorRate' },
                                    apiLatency: { $avg: '$apiLatency' },
                                    cpu: { $avg: '$resourceUsage.cpu' },
                                    memory: { $avg: '$resourceUsage.memory' },
                                    bandwidth: { $avg: '$resourceUsage.bandwidth' }
                                }
                            }
                        ]);

                        // If no real data, use mock data
                        const metrics = realtimeMetrics[0] || {
                            activeUsers: Math.floor(Math.random() * 10) + 1,
                            pageViews: Math.floor(Math.random() * 20) + 5,
                            errorRate: Math.random() * 0.5,
                            apiLatency: Math.floor(Math.random() * 50) + 50,
                            cpu: Math.floor(Math.random() * 30) + 20,
                            memory: Math.floor(Math.random() * 30) + 30,
                            bandwidth: Math.random() * 3 + 1
                        };

                        // Format the SSE data
                        const data = `data: ${JSON.stringify({
                            timestamp: new Date(),
                            metrics
                        })}\n\n`;

                        // Send the data
                        controller.enqueue(encoder.encode(data));
                    } catch (error) {
                        console.error('Error sending metrics:', error);
                        // Send error event
                        const errorData = `event: error\ndata: ${JSON.stringify({ error: 'Failed to fetch metrics' })}\n\n`;
                        controller.enqueue(encoder.encode(errorData));
                    }
                };

                // Send initial data
                await sendMetrics();

                // Set up interval to send data every 5 seconds
                const interval = setInterval(sendMetrics, 5000);

                // Cleanup on close
                return () => {
                    clearInterval(interval);
                };
            }
        });

        return new Response(stream, { headers: responseHeaders });
    } catch (error) {
        console.error('Real-time analytics error:', error);
        return Response.json(
            { success: false, error: 'Failed to initialize real-time analytics' },
            { status: 500 }
        );
    }
} 