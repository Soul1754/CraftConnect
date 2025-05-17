import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CustomerLayout from "../../Layout/CustomerLayout";
import { getBookingById } from "../../../Services/BookingService";
import { submitReview } from "../../../Services/BookingService";

const ReviewForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(bookingId);
      setBooking(data);

      // Check if booking is completed
      if (data.status !== "completed") {
        setError(
          "This booking is not yet completed. You can only review completed bookings."
        );
      }

      // Check if booking is already reviewed
      if (data.reviewed) {
        setError("You have already submitted a review for this booking.");
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.message || "Failed to load booking details");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await submitReview(bookingId, formData.rating, formData.comment);
      alert("Review submitted successfully!");
      navigate("/customer/appointments");
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.message || "Failed to submit review");
      setLoading(false);
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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/customer/appointments")}
          className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
        >
          Back to Appointments
        </button>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Review</h1>

        {booking && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="font-semibold text-lg mb-2">{booking.name}</h2>
            <p className="text-gray-600 mb-2">{booking.description}</p>
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Professional:</span>
              <span className="font-medium">{booking.professional.name}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    checked={formData.rating === star}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-8 w-8 ${
                      formData.rating >= star
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </label>
              ))}
              <span className="ml-2 text-gray-600">
                {formData.rating} {formData.rating === 1 ? "Star" : "Stars"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Comment (Optional)
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="4"
              placeholder="Share your experience with this service..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/customer/appointments")}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
};

export default ReviewForm;
