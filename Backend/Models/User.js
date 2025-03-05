// models/User.js
const mongoose = require("mongoose");



const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "professional", "admin"],
    required: true,
  },
  phone: String,
  address: String,
  // Update location if you’re using GeoJSON:
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },
  profilePicture: String,
  // Embed the services directly instead of referencing them by ObjectId.
  servicesOffered: [{type:mongoose.Schema.Types.ObjectId, ref: "Service"}],
  rating: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  createdAt: { type: Date, default: Date.now },
  profileCompleted: { type: Boolean, default: false },
});

// Create a geospatial index on location if needed.
UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
