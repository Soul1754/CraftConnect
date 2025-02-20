import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
export default function ProfessionalSignupStep2() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    console.log("Email from state:", email);
    if (!email) {
      alert("Email is missing. Please complete the previous step.");
      navigate("/signup/professional/step1");
    }
  }, [email, navigate]);

  const handleSendOTP = async () => {
    if (!email || !phone) {
      alert("Email and phone are required");
      return;
    }
      try {
        console.log("Sending OTP to", email, phone);
      const res = await axios.post("http://localhost:5001/api/auth/send-otp", {
        email,
        phone,
      });
      if (res.data.message === "OTP sent successfully") {
        alert("OTP sent successfully");
        setOtpSent(true);
      }
    } catch (error) {
      console.error("Error sending OTP", error.response?.data || error.message);
      alert(
        "Error sending OTP: " + (error.response?.data.message || error.message)
      );
    }
  };

  const handleVerifyOTP = async () => {
    if (!email || !otp) {
      alert("Email and OTP are required");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/verify-otp",
        { email, otp }
      );
      if (res.status === 201) {
          alert("OTP verified. Registration successful!");
        localStorage.setItem("token", res.data.token);
        navigate("/professional/complete-profile");
      }
    } catch (error) {
      console.error("OTP verification error", error);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">
        Professional Signup - Step 2 (Phone Verification)
      </h1>
      <div className="flex flex-col space-y-4 items-center">
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <button
          onClick={handleSendOTP}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send OTP
        </button>
        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="p-2 border rounded"
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
