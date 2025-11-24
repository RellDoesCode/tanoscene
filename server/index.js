import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

mongoose.connect("mongodb+srv://tbeasle1_db_user:aLszrIGrNegvZwB0@user.kr9qawq.mongodb.net/?appName=user")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));