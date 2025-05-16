import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ProfessionalLayout from "../../Layout/ProfessionalLayout";
import {
  getUserBookings,
  sendWorkCompletionOTP,
  markBookingAsDone,
} from "../../../Services/BookingService";
import { initiatePayout } from "../../../Services/PaymentService";

const ProfessionalAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [payoutDetails, setPayoutDetails] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings("professional");
      setAppointments(response);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments");
      setLoading(false);
    }
  };

  // Handle sending OTP for work completion
  const handleSendOTP = async (booking) => {
    try {
      setSelectedBooking(booking);
      setProcessingAction(true);
      
      // Check if customer has a phone number
      if (!booking.customer.phone) {
        alert("Customer does not have a phone number registered. OTP cannot be sent.");
        setProcessingAction(false);
        return;
      }
      
      await sendWorkCompletionOTP(booking._id);
      setShowOtpModal(true);
      setProcessingAction(false);
    } catch (err) {
      console.error("Error in handleSendOTP:", err);
      alert(err.message || "Failed to send OTP. Please check console for details.");
      setProcessingAction(false);
    }
  };

  // Handle OTP verification and mark booking as done
  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setProcessingAction(true);
      const result = await markBookingAsDone(selectedBooking._id, otp);
      setShowOtpModal(false);
      setOtp("");

      // Show payout details
      setPayoutDetails({
        amount: result.booking.price * 0.9, // 90% of booking price (10% platform fee)
        payoutStatus: "ready",
        bookingId: result.booking._id,
      });
      setShowPayoutModal(true);

      // Refresh bookings
      fetchBookings();
      setProcessingAction(false);
    } catch (err) {
      alert(err.message || "Failed to verify OTP");
      setProcessingAction(false);
    }
  };

  // Handle initiating payout
  const handleInitiatePayout = async () => {
    try {
      setProcessingAction(true);
      const result = await initiatePayout(payoutDetails.bookingId);
      setShowPayoutModal(false);
      setPayoutDetails(null);
      alert(`Payout of ₹${result.amount} processed successfully!`);
      fetchBookings();
      setProcessingAction(false);
    } catch (err) {
      alert(err.message || "Failed to process payout");
      setProcessingAction(false);
    }
  };

  if (loading) {
    return (
      <ProfessionalLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </ProfessionalLayout>
    );
  }

  if (error) {
    return (
      <ProfessionalLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </ProfessionalLayout>
    );
  }

  return (
    <ProfessionalLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Service</th>
                  <th className="py-3 px-6 text-left">Customer</th>
                  <th className="py-3 px-6 text-left">Date & Time</th>
                  <th className="py-3 px-6 text-left">Price</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Payment</th>
                  <th className="py-3 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {appointments.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-6 text-left">
                      <div className="font-medium">{booking.name}</div>
                      <div className="text-xs text-gray-500">
                        {booking.description.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div>{booking.customer.name}</div>
                      <div className="text-xs text-gray-500">
                        {booking.customer.email}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <div>
                        {format(new Date(booking.date), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.time}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-left">₹{booking.price}</td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus.charAt(0).toUpperCase() +
                          booking.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {booking.status !== "completed" &&
                        booking.paymentStatus === "paid" && (
                          <button
                            onClick={() => handleSendOTP(booking)}
                            disabled={processingAction}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Mark Complete
                          </button>
                        )}
                      {booking.status === "completed" &&
                        booking.payoutStatus === "released" && (
                          <span className="text-green-500 text-xs font-medium">
                            Payout Received
                          </span>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Verify Work Completion</h2>
            <p className="mb-4 text-sm text-gray-600">
              An OTP has been sent to the customer's phone. Please ask them to
              share it with you to verify work completion.
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter 6-digit OTP"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={processingAction}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {processingAction ? "Processing..." : "Verify"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && payoutDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Payment Received!</h2>
            <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium text-lg mb-2">
                ₹{payoutDetails.amount.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                Your payment is ready to be processed. This amount reflects the
                service fee minus the platform commission.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPayoutModal(false);
                  setPayoutDetails(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
              <button
                onClick={handleInitiatePayout}
                disabled={processingAction}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {processingAction ? "Processing..." : "Process Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProfessionalLayout>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get payment status color
const getPaymentStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default ProfessionalAppointments;
