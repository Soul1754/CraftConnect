// Backend - models/CommunityPost.js
const mongoose = require("mongoose");

const CommunityPostSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    skillsTagged: [{ type: String, required: true }],
    replies: [
      {
        professional: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);
