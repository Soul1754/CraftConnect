import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register-customer",
        formData
      );
      if (res.status === 201) {
        alert("Registration successful!");
        localStorage.setItem("token", res.data.token);
        navigate("/customer/dashboard");
      }
    } catch (error) {
      console.error(
        "Customer signup error:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Error during registration.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="backdrop-blur-lg bg-gray-800/80 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
