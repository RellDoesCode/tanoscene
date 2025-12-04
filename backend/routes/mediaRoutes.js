// backend/routes/mediaRoutes.js
import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Serve media by GridFS ID
router.get("/:id", async (req, res) => {
  try {
    const fileId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "Invalid file id" });
    }

    // Match the bucket name used in postController.js
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    const filesColl = mongoose.connection.db.collection("uploads.files");
    const fileDoc = await filesColl.findOne({ _id: new mongoose.Types.ObjectId(fileId) });

    if (!fileDoc) return res.status(404).json({ message: "File not found" });

    // Set proper content headers
    res.setHeader("Content-Type", fileDoc.contentType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileDoc.filename || "file"}"`
    );

    // Optional: allow CORS from frontend (adjust origin if needed)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.on("error", (err) => {
      console.error("GridFS download error:", err);
      res.status(500).end();
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("GET /api/media/:id failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
