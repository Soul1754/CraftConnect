import React from 'react';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';

const Feedback = () => {
  // Demo data for reviews
  const reviews = [
    {
      id: 1,
      customer: 'John Doe',
      rating: 5,
      comment: 'Excellent service! Very professional and efficient.',
      date: '2024-02-14',
      service: 'Plumbing Repair'
    },
    {
      id: 2,
      customer: 'Sarah Smith',
      rating: 4,
      comment: 'Good work, but arrived a bit late.',
      date: '2024-02-13',
      service: 'Emergency Plumbing'
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      rating: 5,
      comment: 'Great attention to detail. Will definitely hire again!',
      date: '2024-02-12',
      service: 'Installation'
    }
  ];

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

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Feedback</h1>

        {/* Overall Rating */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">Overall Rating</h2>
              <div className="flex items-center">
                <div className="flex">{renderStars(4)}</div>
                <span className="ml-2 text-2xl font-bold text-gray-900">4.8</span>
                <span className="ml-2 text-gray-600">(124 reviews)</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center">
                    <span className="w-12 text-sm text-gray-600">{star} stars</span>
                    <div className="flex-1 h-2 mx-2 bg-gray-200 rounded">
                      <div
                        className="h-2 bg-yellow-400 rounded"
                        style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                      ></div>
                    </div>
                    <span className="w-12 text-sm text-gray-600">
                      {star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : star === 2 ? '2%' : '1%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <div key={review.id} className="p-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{review.customer}</h3>
                    <p className="text-sm text-gray-500">{review.service}</p>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <div className="mt-2">
                  <div className="flex mb-1">{renderStars(review.rating)}</div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default Feedback;