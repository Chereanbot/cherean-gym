'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaStar, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState(null);
    
    useEffect(() => {
        fetchReviews();
    }, [currentPage, selectedStatus]);
    
    const fetchReviews = async () => {
        try {
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                status: selectedStatus
            });
            
            const response = await fetch(`/api/reviews?${params}`);
            const data = await response.json();
            
            if (data.success) {
                setReviews(data.data.reviews);
                setTotalPages(data.data.pagination.total);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
        } finally {
            setLoading(false);
        }
    };
    
    const handleStatusChange = async (reviewId, newStatus) => {
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success(`Review ${newStatus} successfully`);
                fetchReviews();
            } else {
                toast.error(data.message || `Failed to ${newStatus} review`);
            }
        } catch (error) {
            console.error(`Error ${newStatus} review:`, error);
            toast.error(`Error ${newStatus} review`);
        }
    };
    
    const handleDeleteClick = (review) => {
        setReviewToDelete(review);
        setIsDeleteModalOpen(true);
    };
    
    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/reviews/${reviewToDelete._id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success('Review deleted successfully');
                setIsDeleteModalOpen(false);
                setReviewToDelete(null);
                fetchReviews();
            } else {
                toast.error(data.message || 'Failed to delete review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            toast.error('Error deleting review');
        }
    };
    
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
            />
        ));
    };
    
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </AdminLayout>
        );
    }
    
    return (
        <AdminLayout>
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Reviews</h1>
                    
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Review
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rating
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Reviewer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reviews.map((review) => (
                                <tr key={review._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {review.title}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {review.content.substring(0, 100)}...
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            {renderStars(review.rating)}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {review.rating.toFixed(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {review.serviceType}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {review.reviewer.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {review.reviewer.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {review.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(review._id, 'approved')}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(review._id, 'rejected')}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(review)}
                                                className="text-gray-600 hover:text-gray-900"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
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
            
            {/* Delete Confirmation Modal */}
            <Dialog
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                className="fixed inset-0 z-10 overflow-y-auto"
            >
                <div className="flex items-center justify-center min-h-screen">
                    <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    
                    <div className="relative bg-white rounded-lg max-w-md mx-auto p-6">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                            Confirm Delete
                        </Dialog.Title>
                        
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this review? This action cannot be undone.
                            </p>
                        </div>
                        
                        <div className="mt-4 flex justify-end space-x-4">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </AdminLayout>
    );
} 