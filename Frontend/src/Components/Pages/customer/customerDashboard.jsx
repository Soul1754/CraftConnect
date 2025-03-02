import React from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';

const CustomerDashboard = () => {
    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to the Customer Dashboard</h1>
                <p className="text-gray-600">Here you can view your orders, update your profile, and much more.</p>
            </div>
        </CustomerLayout>
    );
};

export default CustomerDashboard;