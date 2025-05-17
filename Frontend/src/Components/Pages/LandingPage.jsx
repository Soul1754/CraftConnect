import React from "react";
import { Link } from "react-router-dom";
import LandingNavbar from "../Others/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="relative w-full min-h-screen bg-gray-50 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-black rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black rounded-full translate-x-1/3 translate-y-1/3" />
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-6xl mx-auto px-6 py-16 min-h-screen">
        {/* Content */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">CraftConnect</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">Where skills meet opportunity, seamlessly.</p>
          <p className="text-base text-gray-500 mb-8 max-w-md">Connect with skilled professionals in your area or showcase your expertise to clients looking for quality services.</p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-8 py-4 bg-black text-white font-medium rounded-lg shadow-sm">
              Find Services
            </button>
            
            <button className="px-8 py-4 bg-white text-black font-medium border border-gray-300 rounded-lg shadow-sm">
              Offer Your Skills
            </button>
          </div>
          
          <div className="mt-8 flex items-center text-sm text-gray-500">
            <div className="flex -space-x-2 mr-3">
              
            </div>
            
          </div>
        </div>
        
        {/* Image/Illustration */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="w-full max-w-md bg-white border border-gray-100 rounded-xl overflow-hidden shadow-lg">
            <img src="https://fastmaidservice.com/wp-content/uploads/2024/02/House-Cleaning-Service-scaled.jpeg" alt=""/>
             <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center text-gray-500 text-sm font-medium">
          CC
        </div>
        <div>
          <div className="text-gray-900 font-medium mb-1">Craft connect</div>
          <div className="text-gray-500 text-sm">By CS-Group 26</div>
        </div>
      </div>
      
    </div>
          </div>
        </div>
      </div>
    </div>
      
      {/* Features Section */}
    <div className="bg-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-12 text-gray-900">
          Why Choose CraftConnect
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-6">
            <div className="mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-3 text-gray-900">Connect with Professionals</h3>
            <p className="text-gray-600">Find skilled craftspeople for your projects with our easy-to-use platform.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="p-6">
            <div className="mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-3 text-gray-900">Secure Payments</h3>
            <p className="text-gray-600">Our platform ensures safe and secure transactions for all services.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="p-6">
            <div className="mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-3 text-gray-900">Community Support</h3>
            <p className="text-gray-600">Join our growing community of professionals and customers.</p>
          </div>
        </div>
      </div>
    </div>
      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-medium mb-2">CraftConnect</h3>
          <p className="text-gray-400 text-sm">Connecting skills with opportunities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
          <Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} CraftConnect. All rights reserved.
      </div>
    </footer>
    </div>
  );
}