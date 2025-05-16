// models/CommunityReply.js
const mongoose = require("mongoose");

const CommunityReplySchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  quotation: {
    amount: { type: Number },
    estimatedTime: { type: String },
    additionalNotes: { type: String }
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityReply", CommunityReplySchema);
