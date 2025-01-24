'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        rating: 0,
        title: '',
        content: '',
        reviewer: {
            name: '',
            email: '',
            company: '',
            position: ''
        },
        categories: {
            expertise: 0,
            communication: 0,
            quality: 0,
            timeline: 0
        },
        serviceType: ''
    });
    
    const [hoveredRatings, setHoveredRatings] = useState({
        main: 0,
        expertise: 0,
        communication: 0,
        quality: 0,
        timeline: 0
    });
    
    const serviceTypes = [
        'Web Development',
        'Mobile Development',
        'UI/UX Design',
        'Consulting',
        'Other'
    ];
    
    const handleRatingClick = (category, rating) => {
        if (category === 'main') {
            setFormData(prev => ({ ...prev, rating }));
        } else {
            setFormData(prev => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [category]: rating
                }
            }));
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('reviewer.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                reviewer: {
                    ...prev.reviewer,
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Review submitted successfully!');
                setFormData({
                    rating: 0,
                    title: '',
                    content: '',
                    reviewer: {
                        name: '',
                        email: '',
                        company: '',
                        position: ''
                    },
                    categories: {
                        expertise: 0,
                        communication: 0,
                        quality: 0,
                        timeline: 0
                    },
                    serviceType: ''
                });
                if (onSuccess) onSuccess(data.data);
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Error submitting review. Please try again.');
        }
    };
    
    const renderStars = (category, value) => {
        return [...Array(10)].map((_, index) => {
            const ratingValue = index + 1;
            return (
                <FaStar
                    key={index}
                    className="cursor-pointer"
                    color={ratingValue <= (hoveredRatings[category] || value) ? "#ffc107" : "#e4e5e9"}
                    size={24}
                    onMouseEnter={() => setHoveredRatings(prev => ({ ...prev, [category]: ratingValue }))}
                    onMouseLeave={() => setHoveredRatings(prev => ({ ...prev, [category]: 0 }))}
                    onClick={() => handleRatingClick(category, ratingValue)}
                />
            );
        });
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Rating*
                </label>
                {renderStars('main', formData.rating)}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expertise Rating
                    </label>
                    {renderStars('expertise', formData.categories.expertise)}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Communication Rating
                    </label>
                    {renderStars('communication', formData.categories.communication)}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quality Rating
                    </label>
                    {renderStars('quality', formData.categories.quality)}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timeline Rating
                    </label>
                    {renderStars('timeline', formData.categories.timeline)}
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title*
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Summarize your experience"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Content*
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Share your experience in detail"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type*
                </label>
                <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="">Select a service type</option>
                    {serviceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name*
                    </label>
                    <input
                        type="text"
                        name="reviewer.name"
                        value={formData.reviewer.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="John Doe"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Email*
                    </label>
                    <input
                        type="email"
                        name="reviewer.email"
                        value={formData.reviewer.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="john@example.com"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                    </label>
                    <input
                        type="text"
                        name="reviewer.company"
                        value={formData.reviewer.company}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Company Name"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                    </label>
                    <input
                        type="text"
                        name="reviewer.position"
                        value={formData.reviewer.position}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Your Position"
                    />
                </div>
            </div>
            
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                    Submit Review
                </button>
            </div>
        </form>
    );
};

export default ReviewForm; 