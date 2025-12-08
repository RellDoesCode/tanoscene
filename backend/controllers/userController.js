import User from "../models/user.js";

// GET own profile
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET profile by username
export const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE PROFILE + media
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.bio) updates.bio = req.body.bio;

    if (req.files?.avatar?.[0]) {
      updates.avatar =
        `${req.protocol}://${req.get("host")}/uploads/${req.files.avatar[0].filename}`;
    }
    if (req.files?.banner?.[0]) {
      updates.banner =
        `${req.protocol}://${req.get("host")}/uploads/${req.files.banner[0].filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true
    }).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// FOLLOW USER
export const followUser = async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: "User not found" });

  if (!target.followers.includes(req.user._id)) {
    target.followers.push(req.user._id);
    await target.save();
  }

  const currentUser = await User.findById(req.user._id)
    .select("-password");
  res.json({ currentUser });
};

// UNFOLLOW USER
export const unfollowUser = async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: "User not found" });

  target.followers = target.followers.filter(
    (id) => id.toString() !== req.user._id.toString()
  );
  await target.save();

  const currentUser = await User.findById(req.user._id)
    .select("-password");
  res.json({ currentUser });
};

// CHECK FOLLOW STATUS
export const checkFollowingStatus = async (req, res) => {
  const target = await User.findOne({ username: req.params.username });
  if (!target) return res.status(404).json({ message: "User not found" });

  const following = target.followers.includes(req.user._id);
  res.json({ following });
};
