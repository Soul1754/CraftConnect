import React, { useState, useEffect } from 'react';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';
import { getProfessionalAnalyticsSummary, getBookingTrends, getRevenueAnalysis } from '../../../Services/AnalyticsService';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [bookingPeriod, setBookingPeriod] = useState('monthly');
  const [revenuePeriod, setRevenuePeriod] = useState('monthly');

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = await getProfessionalAnalyticsSummary();
      setAnalyticsData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
      setLoading(false);
    }
  };

  const handleBookingPeriodChange = async (period) => {
    setBookingPeriod(period);
    try {
      const bookingData = await getBookingTrends(period);
      setAnalyticsData(prev => ({
        ...prev,
        recentBookings: bookingData
      }));
    } catch (err) {
      console.error('Error fetching booking trends:', err);
    }
  };

  const handleRevenuePeriodChange = async (period) => {
    setRevenuePeriod(period);
    try {
      const revenueData = await getRevenueAnalysis(period);
      setAnalyticsData(prev => ({
        ...prev,
        revenueData: revenueData
      }));
    } catch (err) {
      console.error('Error fetching revenue analysis:', err);
    }
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="flex justify-center items-center h-64 px-4 py-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading analytics data...</p>
          </div>
        </div>
      </ProfessionalLayout>
    );
  }

  if (error) {
    return (
      <ProfessionalLayout>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-md shadow-md mx-4 my-6">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="space-y-8 px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-800 border-b pb-3 border-gray-200">Analytics Dashboard</h1>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Bookings</h3>
            <div className="mt-3 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 hover:scale-105">{analyticsData?.totalBookings?.count || 0}</p>
              <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${analyticsData?.totalBookings?.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {analyticsData?.totalBookings?.change >= 0 ? '+' : ''}{analyticsData?.totalBookings?.change || 0}%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Revenue</h3>
            <div className="mt-3 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 hover:scale-105">Rs {analyticsData?.revenue?.amount || 0}</p>
              <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${analyticsData?.revenue?.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {analyticsData?.revenue?.change >= 0 ? '+' : ''}{analyticsData?.revenue?.change || 0}%
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Customer Rating</h3>
            <div className="mt-3 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 hover:scale-105">{analyticsData?.rating?.average || 0}/5</p>
              <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${analyticsData?.rating?.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {analyticsData?.rating?.change >= 0 ? '+' : ''}{analyticsData?.rating?.change || 0}
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Response Rate</h3>
            <div className="mt-3 flex items-baseline">
              <p className="text-3xl font-bold text-gray-900 transition-all duration-300 hover:scale-105">{analyticsData?.responseRate?.rate || 0}%</p>
              <span className={`ml-2 text-sm font-medium px-2 py-0.5 rounded-full ${analyticsData?.responseRate?.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {analyticsData?.responseRate?.change >= 0 ? '+' : ''}{analyticsData?.responseRate?.change || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Bookings Overview
              </h3>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleBookingPeriodChange('weekly')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${bookingPeriod === 'weekly' ? 'bg-black hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => handleBookingPeriodChange('monthly')} 
                  className={`px-3 py-1 text-sm rounded-md ${bookingPeriod === 'monthly' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            {analyticsData?.recentBookings && analyticsData.recentBookings.length > 0 ? (
              <div className="h-64 flex items-end justify-between px-2 pt-4">
                {analyticsData.recentBookings.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center">
                      <span className="absolute -top-7 text-sm font-semibold text-gray-700">{item.count}</span>
                      <div 
                        className="bg-black w-12 rounded-t-md hover:bg-gray-800 transition-colors duration-300" 
                        style={{ height: `${(item.count / Math.max(...analyticsData.recentBookings.map(b => b.count)) || 1) * 180}px` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2 font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-md border border-gray-100">
                <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 font-medium">No booking data available</p>
                <p className="text-gray-400 text-sm mt-1">Data will appear here once you have bookings</p>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Revenue Analysis
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleRevenuePeriodChange('weekly')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${revenuePeriod === 'weekly' ? 'bg-black hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Weekly
                </button>
                <button 
                  onClick={() => handleRevenuePeriodChange('monthly')} 
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${revenuePeriod === 'monthly' ? 'bg-black hover:bg-gray-800 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            {analyticsData?.revenueData && analyticsData.revenueData.length > 0 ? (
              <div className="h-64 flex items-end justify-between px-2 pt-4">
                {analyticsData.revenueData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center">
                      <span className="absolute -top-7 text-sm font-semibold text-gray-700">Rs {item.amount}</span>
                      <div 
                        className="bg-black hover:bg-gray-800 transition-colors duration-300 w-12 rounded-t-md shadow-sm" 
                        style={{ height: `${(item.amount / Math.max(...analyticsData.revenueData.map(r => r.amount)) || 1) * 180}px` }}
                      ></div>
                    </div>
                    <span className="text-xs mt-2 font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-md border border-gray-100">
                <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-medium">No revenue data available</p>
                <p className="text-gray-400 text-sm mt-1">Revenue information will appear once payments are processed</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
            <svg className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {analyticsData?.recentActivity && analyticsData.recentActivity.length > 0 ? (
              analyticsData.recentActivity.map((activity, index) => {
                // Determine icon and color based on activity type
                let iconColor = "bg-black";
                if (activity.type === 'review') {
                  iconColor = "bg-yellow-500";
                } else if (activity.type === 'payment') {
                  iconColor = "bg-green-500";
                }
                
                return (
                  <div key={index} className="flex items-start p-3 hover:bg-gray-50 rounded-md transition-colors duration-200">
                    <div className={`flex-shrink-0 h-4 w-4 rounded-full ${iconColor} mt-1 animate-pulse`}></div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-700">{activity.event}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8 italic">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default Analytics;