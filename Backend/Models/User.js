// models/User.js
const mongoose = require("mongoose");
const { type } = require("os");

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
  location: { type: mongoose.Schema.Types.ObjectId, ref: "Location" },
  profilePicture: String,
  servicesOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  rating:[{type : mongoose.Schema.Types.ObjectId, ref: "Review"}],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
