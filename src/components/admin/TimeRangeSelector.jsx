import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClock } from 'react-icons/fa';

const TimeRangeSelector = ({ onChange, defaultValue = '24h' }) => {
    const [selectedRange, setSelectedRange] = useState(defaultValue);
    const [isOpen, setIsOpen] = useState(false);

    const timeRanges = [
        { value: '1h', label: 'Last Hour', icon: FaClock },
        { value: '24h', label: 'Last 24 Hours', icon: FaClock },
        { value: '7d', label: 'Last 7 Days', icon: FaCalendar },
        { value: '30d', label: 'Last 30 Days', icon: FaCalendar },
        { value: '90d', label: 'Last 90 Days', icon: FaCalendar }
    ];

    const handleSelect = (range) => {
        setSelectedRange(range);
        setIsOpen(false);
        if (onChange) {
            onChange(range);
        }
    };

    const getSelectedLabel = () => {
        return timeRanges.find(range => range.value === selectedRange)?.label || 'Select Range';
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
                <FaClock className="text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">{getSelectedLabel()}</span>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50"
                >
                    <div className="py-2">
                        {timeRanges.map((range) => {
                            const Icon = range.icon;
                            return (
                                <button
                                    key={range.value}
                                    onClick={() => handleSelect(range.value)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                                        selectedRange === range.value
                                            ? 'text-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                            : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    <Icon className="text-lg" />
                                    <span>{range.label}</span>
                                    {selectedRange === range.value && (
                                        <svg
                                            className="w-4 h-4 ml-auto text-primary-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default TimeRangeSelector; 