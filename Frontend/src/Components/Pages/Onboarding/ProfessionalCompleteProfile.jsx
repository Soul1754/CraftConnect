import React, { useState } from "react";
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

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          alert("Unable to fetch location. Please enter manually.");
          console.error("Location error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleServiceChange = (e) =>
    setService({ ...service, [e.target.name]: e.target.value });

  const addService = () => {
    if (
      !service.name ||
      !service.type ||
      !service.rate ||
      !service.description
    ) {
      alert("Fill all service details.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      servicesOffered: [...prev.servicesOffered, service],
    }));
    setService({ name: "", type: "", rate: "", description: "" });
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((_, i) => i !== index),
    }));
  };

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
      console.error("Profile completion error:", error);
      alert(error.response?.data?.message || "Error completing profile.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-100">
          Complete Your Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={fetchLocation}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Fetch My Location
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              name="latitude"
              placeholder="Latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
            />
            <input
              type="number"
              name="longitude"
              placeholder="Longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-100">
              Services Offered
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Service Name"
                value={service.name}
                onChange={handleServiceChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
              />
              <input
                type="text"
                name="type"
                placeholder="Service Type"
                value={service.type}
                onChange={handleServiceChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
              />
              <input
                type="number"
                name="rate"
                placeholder="Rate"
                value={service.rate}
                onChange={handleServiceChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
              />
              <textarea
                name="description"
                placeholder="Service Description"
                value={service.description}
                onChange={handleServiceChange}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:ring focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addService}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
              >
                Add Service
              </button>
            </div>
            {formData.servicesOffered.length > 0 && (
              <ul className="mt-4 space-y-2">
                {formData.servicesOffered.map((s, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-700 p-3 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-gray-100">{s.name}</p>
                      <p className="text-sm text-gray-400">
                        {s.type} - ${s.rate}
                      </p>
                      <p className="text-sm text-gray-400">{s.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
          >
            Complete Profile
          </button>
        </form>
      </div>
    </div>
  );
}
