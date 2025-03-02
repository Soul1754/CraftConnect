import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">CraftConnect</h1>
        <div className="space-x-4">
          <Link to="/customer/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link to="/services" className="hover:underline">
            Services
          </Link>
          <Link to="/customer/communityPost" className="hover:underline">
            Community
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
