import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ProfessionalSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    otp: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  
  useEffect(() => {
    if (state?.email) {
      setFormData((prev) => ({ ...prev, email: state.email }));
      setStep(2);
    }
  }, [state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/register-professional",
        { name: formData.name, email: formData.email, password: formData.password }
      );
      if (res.data.message === "Proceed to phone verification") {
        alert("Email registered. Proceed to phone verification.");
        setStep(2);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone) {
      alert("Please enter a phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/auth/send-otp", {
        email: formData.email,
        phone: formData.phone,
      });
      if (res.data.message === "OTP sent successfully") {
        alert("OTP sent. Check your phone.");
        setOtpSent(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      alert("Enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5001/api/auth/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      if (res.status === 201) {
        alert("OTP verified. Registration successful!");
        localStorage.setItem("token", res.data.token);
        navigate("/professional/complete-profile");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="backdrop-blur-lg bg-gray-800/80 p-8 rounded-2xl shadow-lg w-full max-w-md">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Professional Signup - Step 1</h2>
            <form onSubmit={handleSubmitStep1} className="space-y-4">
              <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500" />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500" />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500" />
              <button type="submit" disabled={loading} className={`w-full p-3 rounded font-bold ${loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700 transition"}`}>{loading ? "Registering..." : "Register"}</button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Professional Signup - Step 2</h2>
            <div className="space-y-4">
              <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500" />
              <button onClick={handleSendOTP} disabled={loading} className={`w-full p-3 rounded font-bold ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}>{loading ? "Sending OTP..." : "Send OTP"}</button>
              {otpSent && (
                <>
                  <input type="text" name="otp" placeholder="Enter OTP" onChange={handleChange} required className="w-full p-3 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-purple-500" />
                  <button onClick={handleVerifyOTP} disabled={loading} className={`w-full p-3 rounded font-bold ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"}`}>{loading ? "Verifying..." : "Verify OTP"}</button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
