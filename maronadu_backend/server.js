const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/maronaduDB")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

app.use("/api", routes);

app.get("/", (req, res) => res.send("✅ Backend is running"));

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`);
});
