import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ProfessionalLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
            to="/professional/analytics"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Analytics
          </Link>
          <Link
            to="/professional/app"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            App
          </Link>
          <Link
            to="/professional/feedback"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Feedback
          </Link>
          <Link
            to="/professional/community"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            Community
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
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  );
}