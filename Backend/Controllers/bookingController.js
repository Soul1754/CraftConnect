const Booking = require("../models/Booking");

const CommunityReply = require("../models/CommunityReply");
// const Post = require("../models/Post");

// Create a new booking from an accepted quotation
exports.createBooking = async (req, res) => {
  try {
    const { replyId, date, time, notes, name, description, price } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find the reply/quotation
    const reply = await CommunityReply.findById(replyId).populate("user post");
    if (!reply) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Verify the customer is the owner of the post
    if (reply.post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to create this booking" });
    }

    // Check if reply is already accepted
    if (reply.status !== "accepted") {
      return res.status(400).json({
        message: "Quotation must be accepted before creating a booking",
      });
    }

    // Get the professional ID from the reply
    const professionalId = reply.user._id;
    const postTags = reply.post.tags;

    // Create the booking
    const newBooking = new Booking({
      customer: userId,
      professional: professionalId,
      name: reply.post.title, // Required field
      description: reply.post.description || "No description provided", // Required field
      price: reply.quotation ? reply.quotation.amount : 0,
      date: date || new Date(),
      time: time || new Date().toLocaleTimeString(), // Use provided time or default to current time
      notes: notes || "", // Add notes if provided
      status: "pending",
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookings for a user (either as customer or professional)
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.params.userType || req.query.role; // Get from params or query for backward compatibility

    let query = {};

    if (userType === "customer") {
      // Customers can see all their bookings
      query.customer = userId;
    } else if (userType === "professional") {
      // Professionals can see all their bookings
      query.professional = userId;
    } else {
      // If no role specified, show all bookings for this user
      query = {
        $or: [{ customer: userId }, { professional: userId }],
      };
    }

    const bookings = await Booking.find(query)
      .populate("customer", "name email phone profilePicture")
      .populate("professional", "name email phone profilePicture")
      // .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(bookingId)
      .populate("customer", "name email phone profilePicture")
      .populate("professional", "name email phone profilePicture");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the user is either the customer or the professional
    if (
      booking.customer._id.toString() !== userId &&
      booking.professional._id.toString() !== userId
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this booking" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check authorization based on the status change
    // Only the professional can confirm a booking
    if (status === "confirmed" && booking.professional.toString() !== userId) {
      return res.status(403).json({
        message: "Only the professional can confirm a booking",
      });
    }

    // Only the customer can mark a booking as completed
    if (status === "completed" && booking.customer.toString() !== userId) {
      return res.status(403).json({
        message: "Only the customer can mark a booking as completed",
      });
    }

    // Either party can cancel
    if (
      status === "cancelled" &&
      booking.customer.toString() !== userId &&
      booking.professional.toString() !== userId
    ) {
      return res.status(403).json({
        message: "Not authorized to cancel this booking",
      });
    }

    // Update the booking
    booking.status = status;
    await booking.save();

    res.json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// In-memory storage for work completion OTPs
const workCompletionOtps = {};

// Send OTP to customer for work completion verification
exports.sendWorkCompletionOTP = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const professionalId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId).populate(
      "customer",
      "name email phone"
    );
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the professional is the one requesting completion
    if (booking.professional.toString() !== professionalId) {
      return res
        .status(403)
        .json({ message: "Not authorized for this booking" });
    }

    // Check if payment is done
    if (booking.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ message: "Payment must be completed first" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration
    workCompletionOtps[bookingId] = {
      otp,
      expires: Date.now() + 300000, // 5 minutes
      customerId: booking.customer._id,
    };

    // Send OTP via Twilio
    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    
    // Ensure phone number is in E.164 format (e.g., +1234567890)
    let phoneNumber = booking.customer.phone;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Customer phone number is missing" });
    }
    
    // Format phone number if it doesn't start with '+'
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+${phoneNumber}`;
    }
    
    try {
      await client.messages.create({
        body: `Your CraftConnect work completion verification code is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
    } catch (twilioError) {
      console.error("Twilio error:", twilioError);
      return res.status(500).json({ 
        message: "Failed to send OTP", 
        error: twilioError.message || "Twilio service error" 
      });
    }

    res.json({ message: "OTP sent to customer for verification" });
  } catch (error) {
    console.error("Error sending work completion OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark booking as done and handle OTP verification
exports.markBookingAsDone = async (req, res) => {
  try {
    const { bookingId, otp } = req.body;
    const userId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the professional is the one marking as done
    if (booking.professional.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to mark this booking as done" });
    }

    // Verify OTP
    const storedOtpData = workCompletionOtps[bookingId];
    if (!storedOtpData) {
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });
    }

    if (Date.now() > storedOtpData.expires) {
      delete workCompletionOtps[bookingId];
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update booking status to completed
    booking.status = "completed";
    // Update payout status to ready
    booking.payoutStatus = "ready";
    await booking.save();

    // Clean up OTP data
    delete workCompletionOtps[bookingId];

    // Trigger payment to professional
    // This would typically call a payment service function
    // For now, we'll just mark it as ready for payout

    res.json({
      message: "Booking marked as completed successfully",
      booking,
      payoutStatus: "ready",
    });
  } catch (error) {
    console.error("Error marking booking as done:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit a review for a completed booking
exports.submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    const customerId = req.user.id;

    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify the customer is the one submitting the review
    if (booking.customer.toString() !== customerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to review this booking" });
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res
        .status(400)
        .json({ message: "Booking must be completed before reviewing" });
    }

    // Create the review
    const Review = require("../models/Review");
    const newReview = new Review({
      customer: customerId,
      professional: booking.professional,
      booking: bookingId,  // Add reference to the booking
      rating,
      comment: comment || "",
    });

    await newReview.save();

    // Update booking to indicate it has been reviewed
    booking.reviewed = true;
    await booking.save();

    res.status(201).json({
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Server error" });
  }
};
