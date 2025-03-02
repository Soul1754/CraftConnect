import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ProfessionalLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navItems = [
    { path: "/professional/dashboard", label: "Dashboard" },
    { path: "/professional/analytics", label: "Analytics" },
    { path: "/professional/app", label: "App" },
    { path: "/professional/feedback", label: "Feedback" },
    { path: "/professional/community", label: "Community" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">CraftConnect</h2>
        </div>
        <nav className="mt-6 px-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 mb-2 rounded-lg transition-colors duration-200 ${location.pathname === item.path
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-3 mt-6 text-left text-red-600 rounded-lg transition-colors duration-200 hover:bg-red-50 hover:text-red-700"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}