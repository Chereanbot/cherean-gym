import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    PieChart, Pie, Cell, ResponsiveContainer,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { FaGlobe, FaMobile, FaDesktop, FaTablet, FaChartLine, FaUsers, FaClock, FaExclamationTriangle, FaServer, FaMemory, FaNetworkWired, FaSpinner } from 'react-icons/fa';

// Custom date formatter
const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Update the color palette for charts and UI elements
const COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6', '#EF4444'];

// Custom theme colors
const THEME = {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    success: '#14B8A6',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    text: {
        primary: '#1F2937',
        secondary: '#4B5563',
        muted: '#9CA3AF'
    }
};

const AdvancedAnalytics = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [timeRange, setTimeRange] = useState('24h');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [realtimeMetrics, setRealtimeMetrics] = useState(null);
    const eventSourceRef = useRef(null);

    // Fetch historical analytics data
    const fetchAnalytics = async () => {
        try {
            const response = await fetch('/api/admin/analytics', {
                headers: {
                    'x-time-range': timeRange
                }
            });
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to fetch analytics');
            }
            
            setMetrics(data.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching analytics:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Set up real-time updates
    useEffect(() => {
        const setupSSE = () => {
            const eventSource = new EventSource('/api/admin/analytics/realtime');
            eventSourceRef.current = eventSource;

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setRealtimeMetrics(data);
                
                // Update relevant metrics with real-time data
                setMetrics(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        visitors: {
                            ...prev.visitors,
                            activeNow: data.metrics.activeUsers
                        },
                        performance: {
                            ...prev.performance,
                            errorRate: data.metrics.errorRate,
                            resourceUsage: {
                                cpu: data.metrics.cpu,
                                memory: data.metrics.memory,
                                bandwidth: data.metrics.bandwidth
                            },
                            apiLatency: data.metrics.apiLatency
                        }
                    };
                });
            };

            eventSource.onerror = (error) => {
                console.error('SSE Error:', error);
                eventSource.close();
                // Retry connection after 5 seconds
                setTimeout(setupSSE, 5000);
            };
        };

        setupSSE();

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const StatCard = ({ icon: Icon, title, value, trend, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-${color}-50`}>
                        <Icon className={`text-${color}-500 text-xl`} />
                    </div>
                    <div>
                        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
                        <p className="text-2xl font-bold text-gray-800">{value}</p>
                    </div>
                </div>
                {trend && (
                    <div className={`${trend > 0 ? 'text-emerald-500' : 'text-rose-500'} flex items-center font-semibold`}>
                        <span className="text-xl mr-1">{trend > 0 ? '↑' : '↓'}</span>
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </motion.div>
    );

    const TabButton = ({ tab, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab
                    ? 'bg-indigo-500 text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            <Icon className="text-lg" />
            <span>{label}</span>
        </button>
    );

    const TimeRangeSelector = () => (
        <div className="flex space-x-2">
            {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        timeRange === range
                            ? 'bg-indigo-500 text-white'
                            : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );

    if (isLoading) {
        return (
            <div className="w-full h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-red-50 dark:bg-red-900 rounded-lg">
                <p className="text-red-500 dark:text-red-200">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="container mx-auto"
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex space-x-4">
                        <TabButton tab="overview" label="Overview" icon={FaChartLine} />
                        <TabButton tab="visitors" label="Visitors" icon={FaUsers} />
                        <TabButton tab="performance" label="Performance" icon={FaClock} />
                        <TabButton tab="errors" label="Errors" icon={FaExclamationTriangle} />
                    </div>
                    <TimeRangeSelector />
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    icon={FaUsers}
                                    title="Active Users"
                                    value={metrics.visitors.activeNow}
                                    trend={10}
                                    color="purple"
                                />
                                <StatCard
                                    icon={FaGlobe}
                                    title="Page Views"
                                    value={metrics.pageViews.total}
                                    trend={5}
                                    color="blue"
                                />
                                <StatCard
                                    icon={FaClock}
                                    title="Avg. Session"
                                    value={`${Math.round(metrics.engagement.avgSessionDuration / 60)}m`}
                                    trend={-2}
                                    color="green"
                                />
                                <StatCard
                                    icon={FaExclamationTriangle}
                                    title="Error Rate"
                                    value={`${metrics.performance.errorRate}%`}
                                    trend={-15}
                                    color="red"
                                />
                            </div>
                        )}

                        {/* Add Performance Tab Content */}
                        {activeTab === 'performance' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={FaServer}
                                        title="Server Load"
                                        value={`${metrics.performance.resourceUsage.cpu}%`}
                                        trend={-5}
                                        color="blue"
                                    />
                                    <StatCard
                                        icon={FaMemory}
                                        title="Memory Usage"
                                        value={`${metrics.performance.resourceUsage.memory}%`}
                                        trend={8}
                                        color="purple"
                                    />
                                    <StatCard
                                        icon={FaNetworkWired}
                                        title="Bandwidth"
                                        value={`${(metrics.performance.resourceUsage.bandwidth / 1024).toFixed(2)} MB/s`}
                                        trend={-2}
                                        color="green"
                                    />
                                    <StatCard
                                        icon={FaSpinner}
                                        title="API Latency"
                                        value={`${metrics.performance.apiLatency}ms`}
                                        trend={-10}
                                        color="yellow"
                                    />
                                </div>

                                {/* Performance Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                    {/* Server Response Time Chart */}
                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Server Response Time</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={metrics.performance.history || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="timestamp" tickFormatter={(time) => formatDate(time)} />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'white',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.75rem'
                                                    }}
                                                    labelStyle={{ color: THEME.text.secondary }}
                                                />
                                                <Line 
                                                    type="monotone" 
                                                    dataKey="serverResponseTime" 
                                                    stroke={THEME.primary} 
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Error Rate Chart */}
                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-800">Error Rate</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={metrics.performance.history || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="timestamp" tickFormatter={(time) => formatDate(time)} />
                                                <YAxis />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'white',
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '0.5rem',
                                                        padding: '0.75rem'
                                                    }}
                                                    labelStyle={{ color: THEME.text.secondary }}
                                                />
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="errorRate" 
                                                    stroke={THEME.danger} 
                                                    fill="#FEE2E2" 
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Resource Usage */}
                                <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">Resource Usage History</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={metrics.performance.history || []}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="timestamp" tickFormatter={(time) => formatDate(time)} />
                                            <YAxis />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'white',
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '0.5rem',
                                                    padding: '0.75rem'
                                                }}
                                                labelStyle={{ color: THEME.text.secondary }}
                                            />
                                            <Legend 
                                                wrapperStyle={{
                                                    paddingTop: '1rem'
                                                }}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="cpu" 
                                                stroke={THEME.info} 
                                                name="CPU Usage"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="memory" 
                                                stroke={THEME.secondary} 
                                                name="Memory Usage"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                            <Line 
                                                type="monotone" 
                                                dataKey="bandwidth" 
                                                stroke={THEME.success} 
                                                name="Bandwidth"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* System Health Indicators */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">System Status</span>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                metrics.performance.uptime > 99
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {metrics.performance.uptime > 99 ? 'Healthy' : 'Warning'}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-2xl font-bold">{metrics.performance.uptime}%</div>
                                            <div className="text-sm text-gray-500">Uptime</div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Load Average</span>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                metrics.performance.resourceUsage.cpu < 70
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-rose-50 text-rose-700'
                                            }`}>
                                                {metrics.performance.resourceUsage.cpu < 70 ? 'Normal' : 'High'}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-2xl font-bold">{metrics.performance.resourceUsage.cpu}%</div>
                                            <div className="text-sm text-gray-500">CPU Usage</div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Memory Status</span>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                metrics.performance.resourceUsage.memory < 80
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-rose-50 text-rose-700'
                                            }`}>
                                                {metrics.performance.resourceUsage.memory < 80 ? 'Normal' : 'High'}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-2xl font-bold">{metrics.performance.resourceUsage.memory}%</div>
                                            <div className="text-sm text-gray-500">Memory Usage</div>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600">Network Status</span>
                                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                                                metrics.performance.apiLatency < 100
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-amber-50 text-amber-700'
                                            }`}>
                                                {metrics.performance.apiLatency < 100 ? 'Good' : 'Slow'}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-2xl font-bold">{metrics.performance.apiLatency}ms</div>
                                            <div className="text-sm text-gray-500">API Latency</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Add Visitors Tab Content */}
                        {activeTab === 'visitors' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <StatCard
                                        icon={FaUsers}
                                        title="Total Visitors"
                                        value={metrics.visitors.total}
                                        trend={15}
                                        color="blue"
                                    />
                                    <StatCard
                                        icon={FaUsers}
                                        title="Unique Visitors"
                                        value={metrics.visitors.unique}
                                        trend={8}
                                        color="purple"
                                    />
                                    <StatCard
                                        icon={FaUsers}
                                        title="Returning Users"
                                        value={metrics.visitors.returning}
                                        trend={12}
                                        color="green"
                                    />
                                    <StatCard
                                        icon={FaUsers}
                                        title="New Users"
                                        value={metrics.visitors.newUsers}
                                        trend={20}
                                        color="yellow"
                                    />
                                </div>

                                {/* Geographic Distribution */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {/* Top Countries */}
                                            <div>
                                                <h4 className="text-md font-medium mb-3">Top Countries</h4>
                                                <div className="space-y-3">
                                                    {metrics.geographic.countries.slice(0, 5).map((country) => (
                                                        <div key={country.code} className="flex items-center justify-between">
                                                            <span className="text-gray-600">{country.name}</span>
                                                            <div className="flex items-center space-x-4">
                                                                <span className="text-sm text-gray-500">{country.visitors} visitors</span>
                                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                                    <div
                                                                        className="bg-blue-500 h-2 rounded-full"
                                                                        style={{
                                                                            width: `${(country.visitors / metrics.visitors.total * 100)}%`
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Device Distribution */}
                                            <div>
                                                <h4 className="text-md font-medium mb-3">Device Types</h4>
                                                <ResponsiveContainer width="100%" height={200}>
                                                    <PieChart>
                                                        <Pie
                                                            data={metrics.devices.devices}
                                                            dataKey="share"
                                                            nameKey="type"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            label
                                                        >
                                                            {metrics.devices.devices.map((entry, index) => (
                                                                <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Add Errors Tab Content */}
                        {activeTab === 'errors' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <StatCard
                                        icon={FaExclamationTriangle}
                                        title="Error Rate"
                                        value={`${metrics.performance.errorRate}%`}
                                        trend={-15}
                                        color="red"
                                    />
                                    <StatCard
                                        icon={FaServer}
                                        title="Server Errors"
                                        value={metrics.performance.serverErrors || 0}
                                        trend={-20}
                                        color="orange"
                                    />
                                    <StatCard
                                        icon={FaGlobe}
                                        title="Client Errors"
                                        value={metrics.performance.clientErrors || 0}
                                        trend={-10}
                                        color="yellow"
                                    />
                                </div>

                                {/* Error Timeline */}
                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold mb-4">Error Timeline</h3>
                                    <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm">
                                        <ResponsiveContainer width="100%" height={300}>
                                            <AreaChart data={metrics.performance.errorHistory || []}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="timestamp" tickFormatter={(time) => formatDate(time)} />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Area
                                                    type="monotone"
                                                    dataKey="serverErrors"
                                                    stackId="1"
                                                    stroke="#F59E0B"
                                                    fill="#FCD34D"
                                                    name="Server Errors"
                                                />
                                                <Area
                                                    type="monotone"
                                                    dataKey="clientErrors"
                                                    stackId="1"
                                                    stroke="#EF4444"
                                                    fill="#FCA5A5"
                                                    name="Client Errors"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                            {/* Visitors Over Time */}
                            <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Visitors Over Time</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={metrics.visitors.history || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="timestamp" tickFormatter={(time) => formatDate(time)} />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="total" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Device Distribution */}
                            <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Device Distribution</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={metrics.devices.devices}
                                            dataKey="share"
                                            nameKey="type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            label
                                        >
                                            {metrics.devices.devices.map((entry, index) => (
                                                <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AdvancedAnalytics; 