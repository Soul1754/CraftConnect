import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';
import { getCustomerReviews } from '../../../Services/ReviewService';

const History = () => {
    const [activities] = useState([
    ]);
    
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchCustomerReviews();
    }, []);

    const fetchCustomerReviews = async () => {
        try {
            setLoading(true);
            const reviewData = await getCustomerReviews();
            setReviews(reviewData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to load your reviews. Please try again later.');
            setLoading(false);
        }
    };

    const getRatingStars = (rating) => {
        if (rating === null) return 'No rating';
        return '⭐'.repeat(rating);
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'Appointment': return '📅';
            case 'Payment': return '💰';
            case 'Post': return '📝';
            case 'Review': return '⭐';
            default: return '📋';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    };

    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity History</h1>

                <div className="mb-6 flex gap-4">
                    <select 
                        className="p-2 border rounded-lg"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                    >
                        <option value="all">All Activities</option>
                        <option value="appointments">Appointments</option>
                        <option value="payments">Payments</option>
                        <option value="posts">Posts</option>
                        <option value="reviews">Reviews</option>
                    </select>

                    <input
                        type="date"
                        className="p-2 border rounded-lg"
                        placeholder="Filter by date"
                    />
                </div>

                {/* General Activity History */}
                {(activeTab === 'all' || activeTab !== 'reviews') && (
                    <div className="space-y-4">
                        {activities
                            .filter(activity => activeTab === 'all' || activity.type.toLowerCase() === activeTab)
                            .map((activity) => (
                                <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <span className="text-2xl" role="img" aria-label={activity.type}>
                                                {getActivityIcon(activity.type)}
                                            </span>
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{activity.type}</h3>
                                                <p className="text-gray-600">{activity.description}</p>
                                                <p className="text-sm text-gray-500 mt-1">{activity.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-yellow-500">
                                            {getRatingStars(activity.rating)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Feedback History Section */}
                {(activeTab === 'all' || activeTab === 'reviews') && (
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Feedback History</h2>
                        
                        {loading && (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {!loading && !error && reviews.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <p>You haven't submitted any reviews yet.</p>
                            </div>
                        )}
                        
                        {!loading && !error && reviews.length > 0 && (
                            <div className="max-h-96 overflow-y-auto pr-2">
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <span className="text-2xl" role="img" aria-label="Appointment">📅</span>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">Appointment</h3>
                                                        <p className="text-gray-600">{review.serviceName} with {review.professionalName}</p>
                                                        <p className="text-sm text-gray-500 mt-1">{formatDate(review.date)}</p>
                                                        {review.comment && (
                                                            <p className="text-gray-600 mt-2 italic">"{review.comment}"</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-yellow-500">
                                                    {getRatingStars(review.rating)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Load More Activities
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default History;