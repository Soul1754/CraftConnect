import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../../../Context/AuthContext"; // Ensure correct path

export default function Login() {
  const { login } = useContext(AuthContext); // ✅ Fix: Get `login` function from context
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      login(res.data.token); // ✅ Fix: Call `login` function to update auth state

      const decoded = jwtDecode(res.data.token);
      if (decoded.role === "customer") navigate("/customer/dashboard");
      else if (decoded.role === "professional")
        navigate("/professional/dashboard");
      else if (decoded.role === "admin") navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
