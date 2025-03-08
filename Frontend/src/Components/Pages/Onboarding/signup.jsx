import React from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border border-slate-100">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">
          Join CraftConnect
          <span className="block text-sm font-normal text-slate-500 mt-1">Choose how you want to get started</span>
        </h2>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/signup/customer")}
            className="w-full py-4 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <span>Sign up as Customer</span>
          </button>
          <button
            onClick={() => navigate("/signup/professional/step1")}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] flex items-center justify-center space-x-2"
          >
            <span>Sign up as Professional</span>
          </button>
        </div>
      </div>
    </div>
  );
}
