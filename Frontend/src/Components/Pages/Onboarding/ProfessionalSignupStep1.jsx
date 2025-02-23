// src/pages/professional/ProfessionalSignupStep1.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfessionalSignupStep1() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register-professional",
        formData
      );
      if (res.data.message === "Proceed to phone verification") {
        alert("Email registered. Proceed to phone verification.");
      navigate("/signup/professional/step2", {
        state: { email: formData.email },
      });
      }
    } catch (error) {
      console.error("Error during professional signup", error);
      alert("Error during registration");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Professional Signup - Step 1</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
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
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
