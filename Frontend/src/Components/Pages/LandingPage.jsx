import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-8">
      <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-3xl w-full text-center border border-slate-100">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to CraftConnect
        </h1>
        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Find skilled professionals or offer your services effortlessly on our modern platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 active:bg-blue-800 transform transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 transform transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
