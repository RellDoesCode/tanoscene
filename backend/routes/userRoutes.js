// backend/routes/userRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  getMe,
  loginUser,
  registerUser,
  updateProfile,
  followUser,
  unfollowUser,
  checkIsFollowing
} from "../controllers/userController.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/signup", registerUser);

// Protected routes
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.get("/:username/isFollowing", protect, checkIsFollowing);
router.post("/:username/follow", protect, followUser);
router.post("/:username/unfollow", protect, unfollowUser);

// Public dynamic route must be last
router.get("/:username", getUserProfile);

export default router;
