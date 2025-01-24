'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ReviewList = ({ serviceType }) => {
    const [reviews, setReviews] = useState([]);
    const [metrics, setMetrics] = useState({
        averageRating: 0,
        totalReviews: 0,
        categories: {
            expertise: 0,
            communication: 0,
            quality: 0,
            timeline: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('createdAt');
    const [order, setOrder] = useState('desc');
    
    useEffect(() => {
        fetchReviews();
    }, [currentPage, sortBy, order, serviceType]);
    
    const fetchReviews = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 5,
                sortBy,
                order,
                ...(serviceType && { serviceType })
            });
            
            const response = await fetch(`/api/reviews?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.data.reviews);
                setMetrics(data.data.metrics);
                setTotalPages(data.data.pagination.total);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <FaStar key={`full-${i}`} className="text-yellow-400" />
            );
        }
        
        if (hasHalfStar) {
            stars.push(
                <FaStarHalf key="half" className="text-yellow-400" />
            );
        }
        
        const remainingStars = 5 - stars.length;
        for (let i = 0; i < remainingStars; i++) {
            stars.push(
                <FaStar key={`empty-${i}`} className="text-gray-300" />
            );
        }
        
        return <div className="flex">{stars}</div>;
    };
    
    const renderMetrics = () => (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-gray-900">
                        {metrics.averageRating.toFixed(1)}
                    </div>
                    <div>
                        {renderStars(metrics.averageRating)}
                        <div className="text-sm text-gray-500 mt-1">
                            {metrics.totalReviews} reviews
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium text-gray-500">Expertise</div>
                        <div className="flex items-center gap-2">
                            {renderStars(metrics.categories.expertise)}
                            <span className="text-sm text-gray-700">
                                {metrics.categories.expertise.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-sm font-medium text-gray-500">Communication</div>
                        <div className="flex items-center gap-2">
                            {renderStars(metrics.categories.communication)}
                            <span className="text-sm text-gray-700">
                                {metrics.categories.communication.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-sm font-medium text-gray-500">Quality</div>
                        <div className="flex items-center gap-2">
                            {renderStars(metrics.categories.quality)}
                            <span className="text-sm text-gray-700">
                                {metrics.categories.quality.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-sm font-medium text-gray-500">Timeline</div>
                        <div className="flex items-center gap-2">
                            {renderStars(metrics.categories.timeline)}
                            <span className="text-sm text-gray-700">
                                {metrics.categories.timeline.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }
    
    return (
        <div>
            {renderMetrics()}
            
            <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Showing {reviews.length} of {metrics.totalReviews} reviews
                </div>
                
                <div className="flex gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="createdAt">Date</option>
                        <option value="rating">Rating</option>
                        <option value="helpful.count">Helpful</option>
                    </select>
                    
                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="desc">Highest First</option>
                        <option value="asc">Lowest First</option>
                    </select>
                </div>
            </div>
            
            <div className="space-y-6">
                {reviews.map((review, index) => (
                    <motion.div
                        key={review._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                    {review.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    {renderStars(review.rating)}
                                    <span className="text-sm text-gray-500">
                                        {review.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{review.content}</p>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">
                                    {review.reviewer.name}
                                </div>
                                {review.reviewer.position && review.reviewer.company && (
                                    <div className="text-sm text-gray-500">
                                        {review.reviewer.position} at {review.reviewer.company}
                                    </div>
                                )}
                            </div>
                            
                            {review.isVerified && (
                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Verified Review
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-md ${
                                currentPage === page
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewList; 