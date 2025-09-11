const mongoose = require("mongoose");

// User schema and model
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
