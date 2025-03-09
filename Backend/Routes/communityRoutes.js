const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware");
const {
  createPost,
  getNearbyPosts,
  submitQuotation,
  getUserPosts,
  acceptQuotation,
  markPostCompleted
} = require("../Controllers/communityController");

// Customer routes
router.post("/posts", protect, createPost);
router.get("/user-posts", protect, getUserPosts);
router.post("/accept-quotation", protect, acceptQuotation);
router.post("/complete-post", protect, markPostCompleted);

// Professional routes
router.get("/nearby-posts", protect, getNearbyPosts);
router.post("/submit-quotation", protect, submitQuotation);

module.exports = router;