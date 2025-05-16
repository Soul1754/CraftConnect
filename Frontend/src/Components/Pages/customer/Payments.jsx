import React, { useState, useEffect } from 'react';
import CustomerLayout from '../../Layout/CustomerLayout';
import axios from 'axios';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    
    useEffect(() => {
        const fetchPaymentHistory = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5001/api/payments/history', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPayments(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching payment history:', err);
                setError('Failed to load payment history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPaymentHistory();
    }, []);

    return (
        <CustomerLayout>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h1>

                <div className="mb-6 flex gap-4">
                    <select 
                        className="p-2 border rounded-lg"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                    </select>

                    <input
                        type="date"
                        className="p-2 border rounded-lg"
                        placeholder="Filter by date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-red-500 text-center py-5">{error}</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professional</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments
                                    .filter(payment => statusFilter === 'all' || payment.status === statusFilter)
                                    .filter(payment => !dateFilter || payment.date === dateFilter)
                                    .map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.service}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.professional}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount.toFixed(2)}</td>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.transactionId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <button className="text-indigo-600 hover:text-indigo-900">View Receipt</button>
                                            </td>
                                        </tr>
                                    ))}
                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No payment records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 flex justify-between items-center">
                    <div className="text-gray-600">
                        <span className="font-semibold">Total Spent:</span>₹{payments.reduce((total, payment) => total + payment.amount, 0).toFixed(2)}
                    </div>
                    <button 
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        onClick={() => alert('Statement download functionality will be implemented in future updates.')}
                    >
                        Download Statement
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Payments;