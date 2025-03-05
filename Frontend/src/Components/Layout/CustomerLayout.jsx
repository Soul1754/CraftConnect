import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function CustomerLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">CraftConnect</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/customer/appointments"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Appointments
          </Link>
          <Link
            to="/customer/payments"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Payments
          </Link>
          <Link
            to="/customer/history"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            History
          </Link>
          <Link
            to="/customer/posts"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Posts
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Search Bar */}
        <div className="p-4 bg-white shadow-sm">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 p-2 border rounded-lg"
            />
            {/* Filters */}
            <select className="p-2 border rounded-lg">
              <option value="">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="carpentry">Carpentry</option>
            </select>
            <select className="p-2 border rounded-lg">
              <option value="">All Locations</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Search
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}