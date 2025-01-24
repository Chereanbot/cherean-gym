import { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaEye, FaClock, FaChartLine, FaBlog, FaProjectDiagram, FaCogs, FaGlobe, FaMobile } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DEFAULT_COLORS = {
    visitors: '#8B5CF6',
    pageViews: '#EC4899',
    session: '#10B981',
    bounceRate: '#F59E0B',
    blogs: '#6366F1',
    projects: '#F43F5E',
    services: '#059669',
    devices: ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B']
};

// Utility functions
const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
};

const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
};

const MetricCard = ({ icon: Icon, title, value, trend, suffix = '', color = '#3B82F6' }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <Icon className="mr-2 text-xl" style={{ color }} />
                <h3 className="font-medium text-gray-800 dark:text-gray-200">{title}</h3>
            </div>
            {trend !== undefined && (
                <span className={`text-sm ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-semibold`}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
                </span>
            )}
        </div>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {value}{suffix}
        </p>
    </div>
);

const MetricsDisplay = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [colors, setColors] = useState(DEFAULT_COLORS);
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    // Fetch real-time metrics
    const fetchRealTimeMetrics = useCallback(async () => {
        try {
            const response = await fetch('/api/analytics/realtime');
            const data = await response.json();
            if (data.success) {
                setMetrics(data.data);
            }
        } catch (error) {
            console.error('Error fetching real-time metrics:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Update WebSocket message handler for real-time updates
    const handleWebSocketMessage = useCallback((data) => {
        if (data.type === 'analytics') {
            setMetrics(data.metrics);
        }
    }, []);

    // Initialize WebSocket connection
    const initializeWebSocket = useCallback(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

        ws.onopen = () => {
            setIsConnected(true);
            ws.send(JSON.stringify({ type: 'subscribe', channel: 'analytics' }));
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
            setTimeout(initializeWebSocket, 5000);
        };

        ws.onerror = () => {
            setIsConnected(false);
        };

        setSocket(ws);

        return () => {
            if (ws) ws.close();
        };
    }, [handleWebSocketMessage]);

    useEffect(() => {
        fetchRealTimeMetrics();
        const cleanup = initializeWebSocket();
        
        // Set up periodic refresh for real-time data
        const refreshInterval = setInterval(fetchRealTimeMetrics, 30000); // Refresh every 30 seconds
        
        return () => {
            cleanup();
            clearInterval(refreshInterval);
        };
    }, [fetchRealTimeMetrics, initializeWebSocket]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-700 h-32 rounded-lg"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Real-Time Analytics</h2>
                    {isConnected ? (
                        <span className="flex items-center text-sm text-emerald-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            Live
                        </span>
                    ) : (
                        <span className="flex items-center text-sm text-amber-500">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
                            Connecting...
                        </span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    icon={FaUsers}
                    title="Active Users"
                    value={formatNumber(metrics?.activeUsers || 0)}
                    color={colors.visitors}
                />
                <MetricCard 
                    icon={FaEye}
                    title="Page Views"
                    value={formatNumber(metrics?.pageViews || 0)}
                    color={colors.pageViews}
                />
                <MetricCard 
                    icon={FaClock}
                    title="Avg. Session"
                    value={formatDuration(metrics?.avgSessionDuration || 0)}
                    color={colors.session}
                />
                <MetricCard 
                    icon={FaChartLine}
                    title="Bounce Rate"
                    value={(metrics?.bounceRate || 0).toFixed(1)}
                    suffix="%"
                    color={colors.bounceRate}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Active Pages</h3>
                    <div className="space-y-2">
                        {metrics?.activePages?.map((page, index) => (
                            <div key={index} className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span className="truncate flex-1 mr-4">{page.path}</span>
                                <span className="font-semibold">{page.activeUsers} users</span>
                            </div>
                        )) || (
                            <div className="text-gray-500 dark:text-gray-400">No active pages</div>
                        )}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">User Activity</h3>
                    <div className="space-y-2">
                        {metrics?.recentActions?.map((action, index) => (
                            <div key={index} className="flex justify-between text-gray-600 dark:text-gray-300">
                                <span className="truncate flex-1 mr-4">{action.type}</span>
                                <span className="text-sm text-gray-500">{new Date(action.timestamp).toLocaleTimeString()}</span>
                            </div>
                        )) || (
                            <div className="text-gray-500 dark:text-gray-400">No recent activity</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MetricsDisplay; 