const CommunityPost = require("../Models/CommunityPosts");
const io = require("../socket");

exports.createPost = async (req, res) => {
  try {
    const post = await CommunityPost.create({
      ...req.body,
      customer: req.user.id,
    });
    io.getIO().emit("newPost", post);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find().populate(
      "customer replies.professional"
    );
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.replyToPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const reply = { professional: req.user.id, message: req.body.message };
    post.replies.push(reply);
    await post.save();

    io.getIO().emit("newReply", { postId: post._id, reply });
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
