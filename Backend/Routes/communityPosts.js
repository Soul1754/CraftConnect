const express = require("express");
const {
  createPost,
  getPosts,
  replyToPost,
} = require("../controllers/communityPostsController");
const router = express.Router();
const { protect } = require("../Middlewares/authMiddleware"); // Destructure the protect function

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.post("/:postId/reply", protect, replyToPost);

module.exports = router;
