import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomerLayout from "../../Layout/CustomerLayout";

const BookingForm = () => {
  const { replyId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [post, setPost] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "10:00",
    notes: "",
  });

  // Fetch quotation details when component mounts
  useEffect(() => {
    const fetchQuotationDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must be logged in to view this page");
          return;
        }

        const response = await axios.get(
          `http://localhost:5001/api/community/quotation/${replyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setQuotation(response.data.reply);
        setPost(response.data.post);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quotation details:", err);
        setError(
          err.response?.data?.message || "Failed to load quotation details"
        );
        setLoading(false);
      }
    };

    fetchQuotationDetails();
  }, [replyId]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to create a booking");
        return;
      }

      const response = await axios.post(
        "http://localhost:5001/api/bookings/create",
        {
          replyId,
          date: bookingData.date,
          time: bookingData.time,
          amount: quotation.quotation.amount,
          notes: bookingData.notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Booking created, now create payment order
      const bookingId = response.data.booking._id;
      const amount = quotation.quotation.amount; // Assuming quotation object has amount

      const paymentOrderResponse = await axios.post(
        "http://localhost:5001/api/payments/create-order",
        {
          bookingId,
          amount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { order_id, key_id } = paymentOrderResponse.data;

      // Open Razorpay Checkout
      const options = {
        key: key_id,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "CraftConnect",
        description: `Payment for Booking ID: ${bookingId}`,
        order_id: order_id,
        handler: async function (paymentResponse) {
          // Verify payment on backend
          try {
            await axios.post(
              "http://localhost:5001/api/payments/verify",
              {
                bookingId,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            // Redirect to appointments page after successful payment
            navigate("/customer/appointments", {
              state: { message: "Booking created and payment successful!" },
            });
          } catch (verifyError) {
            console.error("Error verifying payment:", verifyError);
            setError(
              verifyError.response?.data?.message ||
                "Failed to verify payment. Please contact support."
            );
          }
        },
        prefill: {
          // Optional: prefill customer details
          // name: "Customer Name",
          // email: "customer@example.com",
          // contact: "9999999999",
        },
        notes: {
          address: "CraftConnect Transaction",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        setError(
          `Payment Failed: ${response.error.description} (Reason: ${response.error.reason})`
        );
        // Optionally, you can try to delete or mark the booking as payment_failed here
      });
    } catch (err) {
      console.error("Error creating booking or payment:", err);
      setError(
        err.response?.data?.message ||
          "Failed to create booking or initiate payment"
      );
    }
  };

  // Add Razorpay script to head
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);
  try {
    if (loading) {
    }
  } catch (err) {
    console.error("Error creating booking:", err);
    setError(err.response?.data?.message || "Failed to create booking");
  }

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
          Create Booking
        </h1>

        {quotation && post && (
          <div className="mb-6">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-2">{post.content}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center mb-2">
                  {quotation.user.profilePicture ? (
                    <img
                      src={quotation.user.profilePicture}
                      alt={quotation.user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                      <span className="text-gray-600">
                        {quotation.user.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{quotation.user.name}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-2">{quotation.content}</p>

                {quotation.quotation && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800">
                        Quotation Details:
                      </p>
                      <p className="font-bold text-green-600">
                        ${quotation.quotation.amount}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated Time: {quotation.quotation.estimatedTime}
                    </p>
                    {quotation.quotation.additionalNotes && (
                      <p className="text-sm text-gray-600 mt-1">
                        Notes: {quotation.quotation.additionalNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                  min={new Date().toISOString().split("T")[0]} // Set min date to today
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Preferred Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any special requirements or information for the professional"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/customer/posts")}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default BookingForm;
