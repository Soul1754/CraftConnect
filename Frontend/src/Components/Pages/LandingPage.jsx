// src/pages/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Others/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-48 ">
        <h1 className="text-4xl font-bold mb-4">Welcome to CraftConnect</h1>
        <p className="mb-8">
          Connecting you with professionals and customers seamlessly!
        </p>
        <div>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-500 text-white rounded mr-4"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-green-500 text-white rounded"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
