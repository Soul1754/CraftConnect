import React, { useState } from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';

const Payments = () => {
    const [payments] = useState([
        { id: 1, service: 'Plumbing', amount: 150.00, date: '2024-02-20', status: 'Completed', professional: 'John Doe' },
        { id: 2, service: 'Electrical', amount: 200.00, date: '2024-02-18', status: 'Pending', professional: 'Jane Smith' },
    ]);

    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h1>

                <div className="mb-6 flex gap-4">
                    <select className="p-2 border rounded-lg">
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                    </select>

                    <input
                        type="date"
                        className="p-2 border rounded-lg"
                        placeholder="Filter by date"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.service}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.professional}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <button className="text-indigo-600 hover:text-indigo-900">View Receipt</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <div className="text-gray-600">
                        <span className="font-semibold">Total Spent:</span> $350.00
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                        Download Statement
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Payments;