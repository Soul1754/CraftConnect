import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import CustomerLayout from "../../Layout/CustomerLayout";
import { getUserBookings } from "../../../Services/BookingService";
import {
  createPaymentOrder,
  verifyPayment,
  verifyWorkCompletion,
} from "../../../Services/PaymentService";
import { useNavigate } from "react-router-dom";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const navigate = useNavigate();

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings("customer");
      setAppointments(response);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments");
      setLoading(false);
    }
  };

  // Handle payment initiation
  const handleInitiatePayment = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  // Process payment with Razorpay
  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);

      // Get the service price from the booking
      const amount = selectedBooking.price;

      // Create a payment order
      const orderData = await createPaymentOrder(selectedBooking._id, amount);

      // Initialize Razorpay
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "CraftConnect",
        description: `Payment for ${selectedBooking.price}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            // Verify payment with backend
            await verifyPayment(selectedBooking._id, response);

            // Refresh bookings after payment
            fetchBookings();
            setShowPaymentModal(false);
            alert("Payment successful!");
            navigate(`/customer/review/${selectedBooking._id}`);
          } catch (error) {
            alert("Payment verification failed: " + error.message);
          }
        },
        prefill: {
          name: selectedBooking.customer.name,
          email: selectedBooking.customer.email,
          contact: selectedBooking.customer.phone,
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert("Error initiating payment: " + error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      setPaymentProcessing(true);
      await verifyWorkCompletion(selectedBooking._id, otp);
      fetchBookings();
      setShowOtpModal(false);
      setOtp("");
      alert("Work verified and payment released successfully!");
    } catch (error) {
      alert("OTP verification failed: " + error.message);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "hh:mm a");
    } catch (error) {
      return "";
    }
  };

  // Get status badge color
  const getStatusBadgeClass = (status) => {
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

  // Get payment status badge color
  const getPaymentStatusBadgeClass = (paymentStatus) => {
    switch (paymentStatus) {
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "released":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Appointments
        </h1>

        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              You don't have any appointments yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professional
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment._id || appointment.id}>
                    {console.log(appointment)}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.professional?.name ||
                        (typeof appointment.professional === "object"
                          ? JSON.stringify(appointment.professional)
                          : appointment.professional)}
                    </td>
                    {console.log(appointment)}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                          appointment.status
                        )}`}
                      >
                        {typeof appointment.status === "string"
                          ? appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)
                          : appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(
                          appointment.paymentStatus
                        )}`}
                      >
                        {typeof appointment.paymentStatus === "string"
                          ? appointment.paymentStatus.charAt(0).toUpperCase() +
                            appointment.paymentStatus.slice(1)
                          : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {appointment.price || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.paymentStatus === "unpaid" && (
                        <button
                          onClick={() => handleInitiatePayment(appointment)}
                          className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-sm"
                        >
                          Pay Now
                        </button>
                      )}
                      {appointment.workCompletionRequested &&
                        appointment.paymentStatus === "paid" && (
                          <button
                            onClick={() => {
                              setSelectedBooking(appointment);
                              setShowOtpModal(true);
                            }}
                            className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
                          >
                            Verify Work
                          </button>
                        )}
                      {!appointment.workCompletionRequested &&
                        appointment.payoutStatus !== "released" && (
                          <span className="text-gray-500 text-sm">
                            Awaiting completion
                          </span>
                        )}
                      
                      {appointment.payoutStatus === "released" &&
                        !appointment.reviewed  && (
                          <button
                          onClick={() =>
                            navigate(`/customer/review/${appointment._id}`)
                          }
                          className="text-white bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm"
                          >
                            Review
                          </button>
                        )}
                        {appointment.reviewed &&
                          appointment.payoutStatus === "released" && (
                            <span className="text-gray-500 text-sm">
                              Work Done
                            </span>
                          )}
                      

                      {!appointment.paymentStatus && (
                        <button className="text-indigo-600 hover:text-indigo-900">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Payment Details</h2>
            <div className="mb-4">
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {selectedBooking.title || selectedBooking}
              </p>
              <p>
                <span className="font-semibold">Professional:</span>{" "}
                {selectedBooking.professional.name ||
                  selectedBooking.professional}
              </p>
              <p>
                <span className="font-semibold">Amount:</span> ₹
                {selectedBooking.price || "100"}
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                disabled={paymentProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={paymentProcessing}
              >
                {paymentProcessing ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Verify Work Completion</h2>
            <p className="mb-4">
              Enter the OTP provided by the professional to verify work
              completion and release payment.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 6-digit OTP"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                disabled={paymentProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={paymentProcessing}
              >
                {paymentProcessing
                  ? "Verifying..."
                  : "Verify & Release Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </CustomerLayout>
  );
};

export default Appointments;
