import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getMe,
  getUserByUsername,
  updateProfile,
  followUser,
  unfollowUser,
  checkFollowingStatus,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${req.user._id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* AUTH USER PROFILE ROUTE */
router.get("/me", protect, getMe);

/* GET USER PROFILE BY USERNAME */
router.get("/:username", protect, getUserByUsername);

/* UPDATE PROFILE */
router.put("/me", protect, upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), updateProfile);

/* FOLLOW SYSTEM */
router.post("/:username/follow", protect, followUser);
router.post("/:username/unfollow", protect, unfollowUser);
router.get("/:username/isFollowing", protect, checkFollowingStatus);

export default router;
