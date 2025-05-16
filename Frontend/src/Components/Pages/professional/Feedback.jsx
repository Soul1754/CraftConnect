import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';
import { getAuthToken } from '../../../Services/AuthService';

const Feedback = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get('https://craftconnect-1-cb4x.onrender.com/api/reviews/professional', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReviews(response.data.reviews || []);
      
      // Calculate statistics
      if (response.data.reviews && response.data.reviews.length > 0) {
        const totalReviews = response.data.reviews.length;
        const sumRatings = response.data.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (sumRatings / totalReviews).toFixed(1);
        
        // Calculate rating distribution
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        response.data.reviews.forEach(review => {
          distribution[review.rating] += 1;
        });
        
        // Convert to percentages
        const percentages = {};
        Object.keys(distribution).forEach(rating => {
          percentages[rating] = Math.round((distribution[rating] / totalReviews) * 100);
        });
        
        setStats({
          averageRating,
          totalReviews,
          ratingDistribution: percentages
        });
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.message || 'Failed to load reviews');
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProfessionalLayout>
    );
  }

  if (error) {
    return (
      <ProfessionalLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Feedback</h1>

        {/* Overall Rating */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Overall Rating</h2>
              {reviews.length > 0 ? (
                <div className="flex items-center">
                  <div className="flex">{renderStars(Math.round(stats.averageRating))}</div>
                  <span className="ml-2 text-2xl font-bold text-gray-900">{stats.averageRating}</span>
                  <span className="ml-2 text-gray-600">({stats.totalReviews} reviews)</span>
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet</p>
              )}
            </div>
            {reviews.length > 0 && (
              <div className="flex-1">
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center">
                      <span className="w-12 text-sm text-gray-600">{star} stars</span>
                      <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
                        <div
                          className="h-2 bg-yellow-400 rounded"
                          style={{ width: `${stats.ratingDistribution[star] || 0}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-sm text-gray-600">
                        {stats.ratingDistribution[star] || 0}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          </div>
          {reviews.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review._id || review.id} className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{review.customerName}</h3>
                      <p className="text-sm text-gray-500">{review.serviceName}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex mb-1">{renderStars(review.rating)}</div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No reviews available yet.
            </div>
          )}
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default Feedback;