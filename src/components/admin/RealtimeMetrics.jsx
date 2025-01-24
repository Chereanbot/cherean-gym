import { useState, useEffect, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';

const RealtimeMetrics = ({ onMetricsUpdate }) => {
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const connect = useCallback(() => {
        try {
            const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000');

            ws.onopen = () => {
                console.log('WebSocket connected');
                setConnected(true);
                setError(null);
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'metrics') {
                        onMetricsUpdate(data.metrics);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('Failed to connect to metrics server');
                setConnected(false);
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                setConnected(false);
                // Attempt to reconnect after 5 seconds
                setTimeout(connect, 5000);
            };

            setSocket(ws);

            return () => {
                if (ws) {
                    ws.close();
                }
            };
        } catch (err) {
            console.error('Error creating WebSocket:', err);
            setError('Failed to connect to metrics server');
        }
    }, [onMetricsUpdate]);

    useEffect(() => {
        connect();
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [connect]);

    if (error) {
        return (
            <div className="flex items-center text-red-500 text-sm">
                <span className="mr-2">●</span>
                {error}
            </div>
        );
    }

    return (
        <div className="flex items-center text-sm">
            {connected ? (
                <span className="flex items-center text-green-500">
                    <span className="mr-2">●</span>
                    Real-time updates active
                </span>
            ) : (
                <span className="flex items-center text-yellow-500">
                    <FaSpinner className="animate-spin mr-2" />
                    Connecting to metrics server...
                </span>
            )}
        </div>
    );
};

export default RealtimeMetrics; 