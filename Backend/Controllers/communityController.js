const Post = require("../Models/Post");
const CommunityReply = require("../Models/CommunityReply");
const User = require("../Models/User");

// Create a new community post
exports.createPost = async (req, res) => {
  try {
    const { title, content, tags, longitude, latitude } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate required fields
    if (!title || !content || !tags || !longitude || !latitude) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Create new post
    const newPost = new Post({
      user: userId,
      title,
      content,
      tags,
      image: req.body.image || "", // Optional image
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get posts by location and service tags (for professionals)
exports.getNearbyPosts = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000, tags } = req.query; // maxDistance in meters (10km default)

    if (!longitude || !latitude) {
      return res
        .status(400)
        .json({ message: "Location coordinates are required" });
    }

    // Build query
    const query = {
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      status: "open", // Only show open posts
    };

    // Filter by tags if provided
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    const posts = await Post.find(query).populate(
      "user",
      "name profilePicture"
    );

    // Calculate distance for each post and add it to the response
    const userPoint = [parseFloat(longitude), parseFloat(latitude)];
    const postsWithDistance = posts.map((post) => {
      const postObj = post.toObject();
      // Calculate distance using MongoDB's $near which sorts by distance
      // The first post is the closest, so we can use the distance from the query
      const postPoint = post.location.coordinates;

      // Calculate distance using Haversine formula
      const R = 6371e3; // Earth radius in meters
      const φ1 = (userPoint[1] * Math.PI) / 180; // latitude in radians
      const φ2 = (postPoint[1] * Math.PI) / 180;
      const Δφ = ((postPoint[1] - userPoint[1]) * Math.PI) / 180;
      const Δλ = ((postPoint[0] - userPoint[0]) * Math.PI) / 180;

      const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // distance in meters

      postObj.distance = distance;
      return postObj;
    });

    res.json(postsWithDistance);
  } catch (error) {
    console.error("Error fetching nearby posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Submit a quotation (for professionals)
exports.submitQuotation = async (req, res) => {
  try {
    const { postId, content, amount, estimatedTime, additionalNotes } =
      req.body;
    const professionalId = req.user.id; // From auth middleware

    // Check if professional has bank details
    const professional = await User.findById(professionalId);
    if (!professional.bankDetails || !professional.bankDetails.accountNumber) {
      return res.status(400).json({
        message:
          "Please add your bank account details before submitting quotations",
        redirectUrl: "/professional/bank-details",
        errorCode: "BANK_DETAILS_REQUIRED",
      });
    }

    // Validate required fields
    if (!postId || !content) {
      return res
        .status(400)
        .json({ message: "Post ID and content are required" });
    }

    // Check if post exists and is still open
    const post = await Post.findOne({ _id: postId, status: "open" });
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or already closed" });
    }

    // Check if professional has already submitted a quotation for this post
    const existingReply = await CommunityReply.findOne({
      post: postId,
      user: professionalId,
    });

    if (existingReply) {
      return res.status(400).json({
        message: "You have already submitted a quotation for this post",
      });
    }

    // Create new reply with quotation
    const newReply = new CommunityReply({
      post: postId,
      user: professionalId,
      content,
      quotation: {
        amount,
        estimatedTime,
        additionalNotes,
      },
    });

    await newReply.save();
    res.status(201).json(newReply);
  } catch (error) {
    console.error("Error submitting quotation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's posts with quotations (for customers)
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Get all posts by the user
    const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

    // Get all replies/quotations for each post
    const postsWithReplies = await Promise.all(
      posts.map(async (post) => {
        const replies = await CommunityReply.find({ post: post._id }).populate(
          "user",
          "name profilePicture role"
        );

        return {
          ...post._doc,
          replies,
        };
      })
    );

    res.json(postsWithReplies);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept a quotation (for customers)
exports.acceptQuotation = async (req, res) => {
  try {
    const { replyId } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find the reply
    const reply = await CommunityReply.findById(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Find the post and verify ownership
    const post = await Post.findById(reply.post);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this quotation" });
    }

    // Update reply status
    reply.status = "accepted";
    await reply.save();

    // Update post status
    post.status = "in-progress";
    await post.save();

    // Return the reply ID so the frontend can redirect to booking creation
    res.json({
      message: "Quotation accepted successfully",
      reply,
      post,
      redirectToBooking: true,
      replyId: reply._id,
    });
  } catch (error) {
    console.error("Error accepting quotation:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get quotation details by reply ID
exports.getQuotationById = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user.id; // From auth middleware

    // Find the reply/quotation
    const reply = await CommunityReply.findById(replyId)
      .populate("user", "name email phone profilePicture")
      .populate("post");

    if (!reply) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // Find the post
    const post = await Post.findById(reply.post._id).populate("user");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify the customer is the owner of the post
    if (post.user._id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this quotation" });
    }

    // Return the quotation details
    res.json({
      reply,
      post,
    });
  } catch (error) {
    console.error("Error fetching quotation details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark post as completed (for customers)
exports.markPostCompleted = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id; // From auth middleware

    // Find the post and verify ownership
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Update post status
    post.status = "completed";
    await post.save();

    res.json({ message: "Post marked as completed", post });
  } catch (error) {
    console.error("Error marking post as completed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
