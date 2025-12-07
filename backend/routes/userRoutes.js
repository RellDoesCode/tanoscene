// backend/routes/userRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { getUserById, updateUserById } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

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
    const uniqueName = `${req.user.id}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload avatar
router.post("/me/avatar", authenticateToken, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const updatedUser = await updateUserById(req.user.id, { avatar: avatarUrl });

    res.json({ avatarUrl, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload avatar." });
  }
});

// Upload banner
router.post("/me/banner", authenticateToken, upload.single("banner"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const bannerUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const updatedUser = await updateUserById(req.user.id, { banner: bannerUrl });

    res.json({ bannerUrl, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to upload banner." });
  }
});

export default router;
