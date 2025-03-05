import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="backdrop-blur-lg bg-gray-800/80 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        <div className="flex flex-col space-y-4">
          <button
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
            onClick={() => navigate("/signup/customer")}
          >
            Sign up as Customer
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
            onClick={() => navigate("/signup/professional/step1")}
          >
            Sign up as Professional
          </button>
        </div>
      </div>
    </div>
  );
}
