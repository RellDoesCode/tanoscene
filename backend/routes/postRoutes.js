import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  getPost,
  likePost,
  repostPost,
  commentPost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/feed", protect, getFeedPosts);

router.get("/", protect, async (req, res, next) => {
  return getFeedPosts(req, res, next);
});

router.get("/user/:username", protect, getUserPosts);

router.get("/:id", protect, getPost);

router.post("/", protect, upload.single("media"), createPost);

router.post("/:id/like", protect, likePost);

router.post("/:id/repost", protect, repostPost);

router.post("/:id/comment", protect, commentPost);

export default router;
