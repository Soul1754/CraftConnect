// models/Booking.js
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // New field for tim
  notes: { type: String },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  paymentId: { type: String }, // Razorpay Order ID
  transactionId: { type: String }, // Razorpay Payment ID
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  payoutStatus: {
    type: String,
    enum: ["pending", "ready", "released"],
    default: "pending",
  },
  reviewed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
