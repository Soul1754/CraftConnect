import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
  <nav className="bg-white border-b border-gray-100 p-4 w-full sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-2xl font-medium text-black">
          CraftConnect
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="px-5 py-2 text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Login
          </a>
          <a
            href="/signup"
            className="px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign Up
          </a>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 py-2 bg-white border-t border-gray-100">
          <a
            href="/login"
            className="block py-3 px-4 text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </a>
          <a
            href="/signup"
            className="block py-3 px-4 text-gray-900 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(false)}
          >
            Sign Up
          </a>
        </div>
      )}
    </nav>
  );
}