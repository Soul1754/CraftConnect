import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../Others/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 md:py-20">
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl shadow-2xl max-w-3xl w-full text-center border border-slate-100 card">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to CraftConnect
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto">
            Find skilled professionals or offer your services effortlessly on our modern platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 active:bg-blue-800 transform transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 btn"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 transform transition duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 btn"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-12 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Choose CraftConnect?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-6 rounded-xl shadow-md card">
              <div className="text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect with Professionals</h3>
              <p className="text-slate-600">Find skilled craftspeople for your projects with our easy-to-use platform.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-xl shadow-md card">
              <div className="text-purple-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-slate-600">Our platform ensures safe and secure transactions for all services.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-xl shadow-md card">
              <div className="text-blue-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Support</h3>
              <p className="text-slate-600">Join our growing community of professionals and customers.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-xl font-bold mb-2">CraftConnect</h3>
            <p className="text-slate-300 text-sm">Connecting skills with opportunities</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="text-slate-300 hover:text-white transition-colors">Sign Up</Link>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">About Us</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-700 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} CraftConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
