const WebSocket = require('ws');
const http = require('http');

// Create HTTP server
const server = http.createServer();

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Store real-time metrics
let realTimeMetrics = {
    activeUsers: 0,
    pageViews: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    activePages: new Map(),
    recentActions: []
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    // Add client to set
    clients.add(ws);
    console.log('Client connected. Total clients:', clients.size);

    // Update active users
    realTimeMetrics.activeUsers = clients.size;
    broadcastMetrics();

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            handleMetricUpdate(data);
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected. Total clients:', clients.size);
        realTimeMetrics.activeUsers = clients.size;
        broadcastMetrics();
    });
});

// Handle metric updates
function handleMetricUpdate(data) {
    switch (data.type) {
        case 'pageview':
            realTimeMetrics.pageViews++;
            updateActivePage(data.path);
            addRecentAction('pageview', data.path);
            break;
        case 'session_update':
            updateSessionMetrics(data);
            break;
        case 'user_action':
            addRecentAction(data.action, data.path);
            break;
    }
    broadcastMetrics();
}

// Update active pages
function updateActivePage(path) {
    const currentCount = realTimeMetrics.activePages.get(path) || 0;
    realTimeMetrics.activePages.set(path, currentCount + 1);
    
    // Convert Map to array for broadcasting
    const activePages = Array.from(realTimeMetrics.activePages.entries())
        .map(([path, count]) => ({ path, activeUsers: count }))
        .sort((a, b) => b.activeUsers - a.activeUsers)
        .slice(0, 5);
    
    realTimeMetrics.activePages = activePages;
}

// Add recent action
function addRecentAction(type, path) {
    realTimeMetrics.recentActions.unshift({
        type,
        path,
        timestamp: Date.now()
    });
    realTimeMetrics.recentActions = realTimeMetrics.recentActions.slice(0, 10);
}

// Update session metrics
function updateSessionMetrics(data) {
    if (data.duration) {
        realTimeMetrics.avgSessionDuration = Math.floor(
            (realTimeMetrics.avgSessionDuration + data.duration) / 2
        );
    }
    if (data.bounced !== undefined) {
        const totalSessions = realTimeMetrics.totalSessions || 0;
        const bouncedSessions = realTimeMetrics.bouncedSessions || 0;
        realTimeMetrics.totalSessions = totalSessions + 1;
        realTimeMetrics.bouncedSessions = data.bounced ? bouncedSessions + 1 : bouncedSessions;
        realTimeMetrics.bounceRate = (realTimeMetrics.bouncedSessions / realTimeMetrics.totalSessions) * 100;
    }
}

// Broadcast metrics to all connected clients
function broadcastMetrics() {
    const message = JSON.stringify({
        type: 'metrics',
        metrics: realTimeMetrics
    });

    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Start server
const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
    console.log(`WebSocket server is running on port ${PORT}`);
}); 