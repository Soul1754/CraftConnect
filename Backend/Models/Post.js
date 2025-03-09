// models/Post.js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  tags: [{ type: String, required: true }], // Service-based tags like plumber, electrician, etc.
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "completed"],
    default: "open",
  },
  createdAt: { type: Date, default: Date.now },
});

// Create a geospatial index on location
PostSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Post", PostSchema);
