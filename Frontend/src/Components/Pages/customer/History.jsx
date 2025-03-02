import React, { useState } from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';

const History = () => {
    const [activities] = useState([
        { id: 1, type: 'Appointment', description: 'Plumbing service with John Doe', date: '2024-02-20', rating: 5 },
        { id: 2, type: 'Payment', description: 'Paid for electrical work', date: '2024-02-18', rating: 4 },
        { id: 3, type: 'Post', description: 'Posted a request for carpentry work', date: '2024-02-15', rating: null },
        { id: 4, type: 'Review', description: 'Left a review for Jane Smith', date: '2024-02-10', rating: 5 }
    ]);

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

    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity History</h1>

                <div className="mb-6 flex gap-4">
                    <select className="p-2 border rounded-lg">
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

                <div className="space-y-4">
                    {activities.map((activity) => (
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