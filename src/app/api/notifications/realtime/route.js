import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import connectToDB from '@/database'
import Notification from '@/models/Notification'

export const dynamic = 'force-dynamic'

export async function GET() {
    const headersList = headers();

    // Set headers for SSE
    const responseHeaders = {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    };

    try {
        await connectToDB();

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const sendNotifications = async () => {
                    try {
                        // Get latest unread notifications
                        const notifications = await Notification.find({ read: false })
                            .sort({ createdAt: -1 })
                            .limit(10);

                        const data = JSON.stringify({
                            notifications,
                            timestamp: new Date().toISOString()
                        });

                        // Send notifications as SSE
                        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                    } catch (error) {
                        console.error('Error fetching realtime notifications:', error);
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Error fetching notifications' })}\n\n`));
                    }
                };

                // Send initial notifications
                await sendNotifications();

                // Set up interval to send updates every 5 seconds
                const interval = setInterval(sendNotifications, 5000);

                // Clean up interval when the connection closes
                return () => {
                    clearInterval(interval);
                };
            }
        });

        return new Response(stream, {
            headers: responseHeaders
        });
    } catch (error) {
        console.error('Error in notifications realtime route:', error);
        return NextResponse.json({
            success: false,
            message: 'Error setting up realtime notifications'
        }, { status: 500 });
    }
} 