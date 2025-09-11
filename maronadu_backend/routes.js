const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");
const { User } = require("./models");

const NEWS_API_KEY = "f477df553e14460b885b9cda8738d28a"; // your NewsAPI.org key
const NEWS_API_URL = "https://newsapi.org/v2/top-headlines";

// Register route
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
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
});

// Login route
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
    console.error(err);
    return res.status(500).json({ message: "Internal error" });
  }
});

// News fetching route by category using NewsAPI.org
router.get("/realtime-news", async (req, res) => {
  const { category } = req.query;
  if (!category)
    return res.status(400).json({ message: "Category query parameter required" });

  try {
    const response = await axios.get(NEWS_API_URL, {
      params: {
        category: category.toLowerCase(),
        country: "us",  // optional: use your preferred country code
        apiKey: NEWS_API_KEY,
        pageSize: 20    // optional: number of articles to fetch
      },
    });
    return res.json(response.data);
  } catch (error) {
    console.error("News API fetch error:", error.message);
    return res.status(500).json({ message: "Failed to fetch live news" });
  }
});

module.exports = router;
