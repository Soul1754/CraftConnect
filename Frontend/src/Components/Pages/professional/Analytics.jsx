import React from 'react';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';

const Analytics = () => {
  // Demo data for analytics
  const stats = [
    { title: 'Total Bookings', value: '124', change: '+12%' },
    { title: 'Revenue', value: 'Rs 3,240', change: '+8%' },
    { title: 'Customer Rating', value: '4.8/5', change: '+0.2' },
    { title: 'Response Rate', value: '95%', change: '+3%' },
  ];

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <span className="ml-2 text-sm font-medium text-green-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bookings Overview</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Booking trends chart will be displayed here</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Analysis</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
              <p className="text-gray-500">Revenue analysis chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { time: '2 hours ago', event: 'New booking received from John Doe' },
              { time: '4 hours ago', event: 'Completed service for Sarah Smith' },
              { time: '1 day ago', event: 'Received 5-star rating from Mike Johnson' },
              { time: '2 days ago', event: 'Updated service pricing' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{activity.event}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default Analytics;