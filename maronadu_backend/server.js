const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// CORS configuration: allow requests only from frontend URL provided as environment variable,
// fallback to localhost for local dev
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: frontendURL,
    credentials: true,
  })
);

// MongoDB connection URI from environment variable for deployment, fallback to localhost for dev
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/maronaduDB";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// API routes
app.use("/api", routes);

// Root endpoint to verify backend is running
app.get("/", (req, res) => res.send("✅ Backend is running"));

// Start server
app.listen(port, () => {
  console.log(`🚀 Backend running on port ${port}`);
});
