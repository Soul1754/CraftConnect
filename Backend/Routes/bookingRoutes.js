const express = require("express");
const router = express.Router();

const { protect } = require("../Middlewares/authMiddleware");
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  sendWorkCompletionOTP,
  markBookingAsDone,
  submitReview,
} = require("../Controllers/bookingController");

// Create a booking from an accepted quotation
router.post("/create", protect, createBooking);

// Get all bookings for a user (either as customer or professional)
router.get("/user/:userType", protect, getUserBookings);

// Get a single booking by ID
router.get("/:bookingId", protect, getBookingById);

// Update booking status
router.put("/:bookingId/status", protect, updateBookingStatus);

// Send OTP for work completion verification
router.post("/send-completion-otp", protect, sendWorkCompletionOTP);

// Route to mark booking as done with OTP verification
router.post("/mark-done", protect, markBookingAsDone);

// Submit a review for a completed booking
router.post("/submit-review", protect, submitReview);

module.exports = router;
