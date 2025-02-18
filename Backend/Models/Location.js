const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: { type: [Number], required: true, index: "2dsphere" }, // [longitude, latitude]
  },
  address: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

module.exports = mongoose.model("Location", LocationSchema);
