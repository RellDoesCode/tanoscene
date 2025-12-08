// backend/controllers/userController.js
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ----------------------
// LOGIN
// ----------------------
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide username and password" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        banner: user.banner,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

// ----------------------
// REGISTER
// ----------------------
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        banner: user.banner,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ----------------------
// GET own profile
// ----------------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------
// GET profile by username
// ----------------------
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------
// UPDATE PROFILE + media
// ----------------------
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.bio) updates.bio = req.body.bio;

    if (req.files?.avatar?.[0]) {
      updates.avatar = `${req.protocol}://${req.get("host")}/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.banner?.[0]) {
      updates.banner = `${req.protocol}://${req.get("host")}/uploads/${req.files.banner[0].filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// ----------------------
// FOLLOW USER
// ----------------------
export const followUser = async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: "User not found" });

  if (!target.followers.includes(req.user._id)) {
    target.followers.push(req.user._id);
    await target.save();
  }

  const currentUser = await User.findById(req.user._id).select("-password");
  res.json({ currentUser });
};

// ----------------------
// UNFOLLOW USER
// ----------------------
export const unfollowUser = async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: "User not found" });

  target.followers = target.followers.filter(id => id.toString() !== req.user._id.toString());
  await target.save();

  const currentUser = await User.findById(req.user._id).select("-password");
  res.json({ currentUser });
};

// ----------------------
// CHECK FOLLOW STATUS
// ----------------------
export const checkFollowingStatus = async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: "User not found" });

  const following = target.followers.includes(req.user._id);
  res.json({ following });
};
