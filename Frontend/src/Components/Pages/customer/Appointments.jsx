import React, { useState } from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';

const Appointments = () => {
    const [appointments] = useState([
        { id: 1, service: 'Plumbing', professional: 'John Doe', date: '2024-02-20', time: '10:00 AM', status: 'Upcoming' },
        { id: 2, service: 'Electrical', professional: 'Jane Smith', date: '2024-02-18', time: '2:00 PM', status: 'Completed' },
    ]);

    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">My Appointments</h1>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.service}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.professional}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'Upcoming' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Book New Appointment
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Appointments;