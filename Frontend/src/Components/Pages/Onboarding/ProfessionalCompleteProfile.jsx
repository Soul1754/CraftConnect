import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfessionalCompleteProfile() {
  const [formData, setFormData] = useState({
    address: "",
    latitude: "",
    longitude: "",
    servicesOffered: [],
  });

  const [service, setService] = useState({
    name: "",
    type: "",
    rate: "",
    description: "",
  });

  const navigate = useNavigate();

  // Auto-fetch user location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          alert("Location access denied. Please enter manually.");
          console.error("Location error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handle input change for address
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input change for a single service
  const handleServiceChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  // Add service to list
  const addService = () => {
    if (
      !service.name ||
      !service.type ||
      !service.rate ||
      !service.description
    ) {
      alert("Please fill in all service details.");
      return;
    }
    setFormData({
      ...formData,
      servicesOffered: [...formData.servicesOffered, service],
    });
    setService({ name: "", type: "", rate: "", description: "" }); // Reset service form
  };

  // Remove a service
  const removeService = (index) => {
    setFormData({
      ...formData,
      servicesOffered: formData.servicesOffered.filter((_, i) => i !== index),
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5001/api/auth/complete-profile",
        formData,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Complete Professional Profile</h1>
      <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
        {/* Address Input */}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="p-2 w-full border rounded"
        />
        {/* Location Fetch Button */}
        <button
          type="button"
          onClick={fetchLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Fetch My Location
        </button>

        {/* Service Addition */}
        <h2 className="text-xl font-semibold mt-4">Add Services</h2>
        <input
          type="text"
          name="name"
          placeholder="Service Name"
          value={service.name}
          onChange={handleServiceChange}
          className="p-2 w-full border rounded"
        />
        <input
          type="text"
          name="type"
          placeholder="Service Type (e.g., Plumbing, Cleaning)"
          value={service.type}
          onChange={handleServiceChange}
          className="p-2 w-full border rounded"
        />
        <input
          type="number"
          name="rate"
          placeholder="Rate (per hour, per job, etc.)"
          value={service.rate}
          onChange={handleServiceChange}
          className="p-2 w-full border rounded"
        />
        <textarea
          name="description"
          placeholder="Service Description"
          value={service.description}
          onChange={handleServiceChange}
          className="p-2 w-full border rounded"
        />
        <button
          type="button"
          onClick={addService}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          Add Service
        </button>

        {/* Display Added Services */}
        <div className="mt-4">
          {formData.servicesOffered.map((s, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded shadow-md flex justify-between items-center"
            >
              <p>
                <strong>{s.name}</strong> - {s.type} - ${s.rate} <br />
                <span className="text-sm">{s.description}</span>
              </p>
              <button
                type="button"
                onClick={() => removeService(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Complete Profile
        </button>
      </form>
    </div>
  );
}
