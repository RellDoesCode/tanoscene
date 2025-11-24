import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

//------------------Signup Route------------------//
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Username or email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign( { id: newUser._id, username: newUser.username },
            "SECRET123",
            { expiresIn: "1h" }
        );

        res.json({
            message: "User created successfully",
            token,
            user: { username: newUser.username, email: newUser.email }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
        });

//------------------Login Route------------------//
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: { username: user.username, email: user.email }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;