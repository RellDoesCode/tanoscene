import Post from "../models/post.js";
import User from "../models/user.js";

// Create a post
export const createPost = async (req, res) => {
  try {
    const { content, media } = req.body;
    const post = new Post({
      author: req.user._id,
      content,
      media: media || [],
    });
    await post.save();
    const populatedPost = await post.populate("author", "username avatar");
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts from self and following users
export const getFeedPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const authors = [user._id, ...user.following]; // assuming `following` is an array of user IDs
    const posts = await Post.find({ author: { $in: authors } })
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all posts by a specific user
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
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single post by ID
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments.author", "username avatar");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Like a post
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    if (!post.likes.includes(userId)) post.likes.push(userId);
    await post.save();

    const populatedPost = await post.populate("author", "username avatar");
    res.status(200).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Repost a post
export const repostPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    if (!post.reposts.includes(userId)) post.reposts.push(userId);
    await post.save();

    const populatedPost = await post.populate("author", "username avatar");
    res.status(200).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Comment on a post
export const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = {
      user: req.user._id,
      content: req.body.content,
    };
    post.comments.push(comment);
    await post.save();

    const populatedPost = await post.populate("author", "username avatar").populate("comments.author", "username avatar");
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};