// backend/controllers/postController.js
import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";

// Upload a buffer to GridFS (if needed elsewhere)
const uploadBufferToGridFS = (buffer, filename, contentType) => {
  return new Promise((resolve, reject) => {
    if (!buffer) return resolve(null);

    try {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: contentType || "application/octet-stream",
      });

      uploadStream.on("error", (err) => reject(err));

      uploadStream.on("finish", (file) => {
        if (!file || !file._id) {
          console.error("GridFS upload finished WITHOUT file info:", file);
          return reject(new Error("GridFS upload failed — no file returned"));
        }
        resolve(`/api/media/${file._id.toString()}`);
      });

      uploadStream.write(buffer);
      uploadStream.end();
    } catch (err) {
      reject(err);
    }
  });
};

// Upload file from multer to GridFS
const uploadFileToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) return resolve(null);

    try {
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads",
      });

      const uploadStream = bucket.openUploadStream(file.originalname, {
        contentType: file.mimetype,
      });

      uploadStream.on("error", (err) => reject(err));

      uploadStream.on("finish", (uploadedFile) => {
        if (!uploadedFile || !uploadedFile._id) {
          console.error("GridFS upload finished WITHOUT file info:", uploadedFile);
          return reject(new Error("GridFS upload failed — no file returned"));
        }
        // Return URL to serve the file via mediaRoutes
        resolve(`/api/media/${uploadedFile._id.toString()}`);
      });

      // Properly write buffer to stream
      uploadStream.write(file.buffer);
      uploadStream.end();
    } catch (err) {
      reject(err);
    }
  });
};

// POST /posts
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;

    let mediaUrl = null;

    if (req.file && req.file.buffer) {
      mediaUrl = await uploadFileToGridFS(req.file);
    }

    const post = new Post({
      author: userId,
      content,
      media: mediaUrl ? [mediaUrl] : [],
    });

    await post.save();
    const populatedPost = await post.populate("author", "username avatar");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("POST /posts failed:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET feed posts
export const getFeedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const authors = [user._id, ...(user.following || [])];
    const posts = await Post.find({ author: { $in: authors } })
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("GET /posts/feed failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET posts by user
export const getUserPosts = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("GET /posts/user/:username failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single post
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    console.error("GET /posts/:id failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LIKE a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    if (post.likes.map(String).includes(String(userId))) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.status(200).json(populatedPost);
  } catch (err) {
    console.error("POST /posts/:id/like failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REPOST a post
export const repostPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    if (!post.reposts.map(String).includes(String(userId))) {
      post.reposts.push(userId);
      await post.save();
    }

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.status(200).json(populatedPost);
  } catch (err) {
    console.error("POST /posts/:id/repost failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// COMMENT on post
export const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      author: req.user._id,
      content: req.body.content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("POST /posts/:id/comment failed:", err);
    res.status(500).json({ message: "Server error" });
  }
};
