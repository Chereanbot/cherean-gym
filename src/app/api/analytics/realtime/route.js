import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// In-memory storage for real-time metrics (in production, use Redis or similar)
let realTimeMetrics = {
    activeUsers: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    activePages: [],
    recentActions: []
};

// Track active sessions
const activeSessions = new Map();

export async function GET() {
    try {
        // In a real application, you would:
        // 1. Get data from your analytics service (Google Analytics, Mixpanel, etc.)
        // 2. Or get data from your real-time database (Redis, etc.)
        // 3. Process and aggregate the data
        
        return NextResponse.json({
            success: true,
            data: realTimeMetrics
        });
    } catch (error) {
        console.error('Error fetching real-time analytics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const headersList = headers();
        const data = await request.json();
        const sessionId = headersList.get('x-session-id');
        const timestamp = Date.now();

        // Update active sessions
        if (sessionId) {
            activeSessions.set(sessionId, {
                lastActivity: timestamp,
                ...data
            });
        }

        // Clean up old sessions (inactive for more than 30 minutes)
        const thirtyMinutesAgo = timestamp - 30 * 60 * 1000;
        for (const [id, session] of activeSessions.entries()) {
            if (session.lastActivity < thirtyMinutesAgo) {
                activeSessions.delete(id);
            }
        }

        // Update real-time metrics
        realTimeMetrics = {
            activeUsers: activeSessions.size,
            pageViews: realTimeMetrics.pageViews + 1,
            avgSessionDuration: calculateAverageSessionDuration(activeSessions),
            bounceRate: calculateBounceRate(activeSessions),
            activePages: getActivePages(activeSessions),
            recentActions: [
                {
                    type: data.action || 'page_view',
                    path: data.path || '/',
                    timestamp
                },
                ...realTimeMetrics.recentActions.slice(0, 9) // Keep last 10 actions
            ]
        };

        return NextResponse.json({
            success: true,
            data: realTimeMetrics
        });
    } catch (error) {
        console.error('Error updating real-time analytics:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update analytics' },
            { status: 500 }
        );
    }
}

// Helper functions
function calculateAverageSessionDuration(sessions) {
    if (sessions.size === 0) return 0;
    const totalDuration = Array.from(sessions.values())
        .reduce((sum, session) => sum + (Date.now() - session.startTime), 0);
    return Math.floor(totalDuration / sessions.size / 1000); // Convert to seconds
}

function calculateBounceRate(sessions) {
    if (sessions.size === 0) return 0;
    const bouncedSessions = Array.from(sessions.values())
        .filter(session => session.pageViews === 1);
    return (bouncedSessions.length / sessions.size) * 100;
}

function getActivePages(sessions) {
    const pageMap = new Map();
    
    Array.from(sessions.values()).forEach(session => {
        const page = session.currentPage || '/';
        pageMap.set(page, (pageMap.get(page) || 0) + 1);
    });

    return Array.from(pageMap.entries())
        .map(([path, users]) => ({ path, activeUsers: users }))
        .sort((a, b) => b.activeUsers - a.activeUsers)
        .slice(0, 5); // Top 5 active pages
} 