import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfessionalLayout from "../../Layout/ProfessionalLayout";

const BankDetails = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bankData, setBankData] = useState({
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
  });

  // Fetch existing bank details if any
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view this page");
          return;
        }

        const response = await axios.get(
          "https://craftconnect-1-cb4x.onrender.com/api/auth/bank-details",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.bankDetails) {
          setBankData(response.data.bankDetails);
        }
      } catch (err) {
        console.error("Error fetching bank details:", err);
        setError(err.response?.data?.message || "Failed to load bank details");
      }
    };

    fetchBankDetails();
  }, []);

  useEffect(() => {
    if (error && error.errorCode === "BANK_DETAILS_REQUIRED") {
      navigate(error.redirectUrl);
    }
  }, [error]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update bank details");
        return;
      }

      await axios.put("https://craftconnect-1-cb4x.onrender.com/api/auth/bank-details", bankData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(true);
      // Redirect after showing success message
      setTimeout(() => {
        navigate("/professional/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error updating bank details:", err);
      setError(err.response?.data?.message || "Failed to update bank details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessionalLayout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bank Account Details
        </h1>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">
              {" "}
              Bank details updated successfully!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="accountHolderName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Holder Name
            </label>
            <input
              type="text"
              id="accountHolderName"
              name="accountHolderName"
              value={bankData.accountHolderName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="accountNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Account Number
            </label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={bankData.accountNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="bankName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={bankData.bankName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="ifscCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              IFSC Code
            </label>
            <input
              type="text"
              id="ifscCode"
              name="ifscCode"
              value={bankData.ifscCode}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/professional/dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Bank Details"}
            </button>
          </div>
        </form>
      </div>
    </ProfessionalLayout>
  );
};

export default BankDetails;