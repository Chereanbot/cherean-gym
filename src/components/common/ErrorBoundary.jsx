import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service here
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-red-600">
                        {this.props.fallbackText || 'Something went wrong.'}
                    </h2>
                    <button 
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }} 
                        className="mt-4 px-4 py-2 bg-green-main text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 