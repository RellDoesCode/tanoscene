import express from "express";
import Post from "../models/post.js";
import User from "../models/user.js";
import {protect as authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ----------------------------------------
   GET ALL POSTS (FEED)
---------------------------------------- */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("GET /posts failed:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

/* ----------------------------------------
   GET POSTS BY USER
---------------------------------------- */
router.get("/user/:username", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ author: user._id })
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error("GET /posts/user/:username failed:", err);
    res.status(500).json({ error: "Failed to fetch user's posts" });
  }
});

/* ----------------------------------------
   CREATE POST
---------------------------------------- */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      author: req.user.id,
      content: req.body.content,
      media: req.body.media || [],
    });

    const populated = await Post.findById(post._id)
      .populate("author", "username avatar");

    res.json(populated);
  } catch (err) {
    console.error("POST /posts failed:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

/* ----------------------------------------
   LIKE POST
---------------------------------------- */
router.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.json(updated);
  } catch (err) {
    console.error("LIKE route failed:", err);
    res.status(500).json({ error: "Failed to like post" });
  }
});

/* ----------------------------------------
   REPOST
---------------------------------------- */
router.post("/:postId/repost", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;

    if (!post.reposts.includes(userId)) {
      post.reposts.push(userId);
    }

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.json(updated);
  } catch (err) {
    console.error("REPOST route failed:", err);
    res.status(500).json({ error: "Failed to repost" });
  }
});

/* ----------------------------------------
   ADD COMMENT
---------------------------------------- */
router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Comment cannot be empty" });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({
      author: req.user.id,
      content,
    });

    await post.save();

    const updated = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.json(updated);
  } catch (err) {
    console.error("COMMENT route failed:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

export default router;
