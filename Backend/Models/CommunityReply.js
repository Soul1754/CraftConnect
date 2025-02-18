// models/CommunityReply.js
const CommunityReplySchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityReply", CommunityReplySchema);
