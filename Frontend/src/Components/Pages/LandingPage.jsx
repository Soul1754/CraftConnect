import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="backdrop-blur-lg bg-gray-800/80 p-10 rounded-2xl shadow-lg max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          Welcome to CraftConnect
        </h1>
        <p className="text-lg mb-6 opacity-80">
          Find skilled professionals or offer your services effortlessly.
        </p>
        <div className="flex gap-4 mt-6">
          <Link
            to="/login"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
