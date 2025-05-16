import React from 'react';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';

const ProfessionalDashboard = () => {
    return (
        <ProfessionalLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Professional Dashboard</h1>
                
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">24</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Today's Schedule</h3>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">5</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">₹1,240</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                        <p className="mt-2 text-2xl font-semibold text-gray-900">4.8/5</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors">
                            <h3 className="font-medium text-blue-600">Manage Services</h3>
                            <p className="text-sm text-gray-600 mt-1">Update your service offerings</p>
                        </button>
                        <button className="p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors">
                            <h3 className="font-medium text-blue-600">View Schedule</h3>
                            <p className="text-sm text-gray-600 mt-1">Check your appointments</p>
                        </button>
                        <button className="p-4 text-left border rounded-lg hover:bg-blue-50 transition-colors">
                            <h3 className="font-medium text-blue-600">Update Profile</h3>
                            <p className="text-sm text-gray-600 mt-1">Manage your information</p>
                        </button>
                    </div>
                </div>
            </div>
        </ProfessionalLayout>
    );
};

export default ProfessionalDashboard;
