import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import crypto from "crypto";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

const conn = mongoose.createConnection(mongoURI);

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
  console.log("GridFS connected");
});

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads"
    };
  }
});

export const upload = multer({ storage });
export const gridfsBucket = () => gfs;
