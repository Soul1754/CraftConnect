import React from 'react';
import ProfessionalLayout from '../../Layout/ProfessionalLayout';

const App = () => {
  // Demo data for appointments
  const appointments = [
    { id: 1, customer: 'John Doe', service: 'Plumbing', date: '2024-02-15', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, customer: 'Sarah Smith', service: 'Electrical', date: '2024-02-15', time: '2:00 PM', status: 'Pending' },
    { id: 3, customer: 'Mike Johnson', service: 'Carpentry', date: '2024-02-16', time: '11:30 AM', status: 'Completed' },
  ];

  // Demo data for services
  const services = [
    { id: 1, name: 'Basic Plumbing', price: '$50/hr', description: 'General plumbing repairs and maintenance' },
    { id: 2, name: 'Emergency Plumbing', price: '$80/hr', description: '24/7 emergency plumbing services' },
    { id: 3, name: 'Installation', price: '$100/hr', description: 'New fixture installation and setup' },
  ];

  return (
    <ProfessionalLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add New Service
          </button>
        </div>

        {/* Appointments Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{appointment.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-blue-600 hover:text-blue-900">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">My Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{service.price}</p>
                <p className="text-gray-600 mt-2">{service.description}</p>
                <div className="mt-4 flex gap-2">
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfessionalLayout>
  );
};

export default App;