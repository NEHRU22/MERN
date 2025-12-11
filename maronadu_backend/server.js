const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS using front-end URL from environment variable, fallback to localhost for local dev
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

// MongoDB Atlas connection
const mongoURI = process.env.atlas_url;
if (!mongoURI) {
  console.error("❌ MONGODB_URI not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// User Schema/Model (simple)
const { Schema, model } = mongoose;
const userSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});
const User = model("User", userSchema);

// Create router for all API routes
const router = require("express").Router();

// Register Route
router.post("/auth/register", async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password)
    return res.status(400).json({ message: "All fields required" });
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashed });
    await user.save();
    return res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({ message: "Internal error" });
  }
});

// Login Route
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });
    return res.status(200).json({
      message: "Login successful",
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Internal error" });
  }
});

// Live News Route (NewsAPI)
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";
router.get("/realtime-news", async (req, res) => {
  const { category } = req.query;
  if (!NEWS_API_KEY)
    return res.status(500).json({ message: "API key not configured" });
  if (!category)
    return res.status(400).json({ message: "Category query parameter required" });
  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        category: category.toLowerCase(),
        country: "us",
        apiKey: NEWS_API_KEY,
        pageSize: 20,
      },
    });
    return res.json(response.data);
  } catch (error) {
    console.error("News API fetch error:", error.message);
    return res.status(500).json({ message: "Failed to fetch live news" });
  }
});

// Use router for API
app.use("/api", router);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});
