// src/pages/professional/ProfessionalCompleteProfile.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfessionalCompleteProfile() {
  const [formData, setFormData] = useState({
    address: "",
    servicesOffered: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  // Convert comma-separated string to an array and trim whitespace
  const servicesArray = formData.servicesOffered
    .split(",")
    .map((s) => s.trim());
  const dataToSend = { ...formData, servicesOffered: servicesArray };

  console.log("Token:", token);
  console.log("Data to send:", dataToSend);

  try {
    await axios.post(
      "http://localhost:5001/api/auth/complete-profile",
      dataToSend,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("Profile completed successfully!");
    navigate("/professional/dashboard");
  } catch (error) {
    console.error(
      "Profile completion error",
      error.response?.data || error.message
    );
    alert(
      "Error completing profile: " +
        (error.response?.data.message || error.message)
    );
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Complete Professional Profile</h1>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="servicesOffered"
          placeholder="Services Offered (comma separated)"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Complete Profile
        </button>
      </form>
    </div>
  );
}
