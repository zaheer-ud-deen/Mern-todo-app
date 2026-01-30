const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register
router.post("/register", async (req, res) => {
  console.log("🔥 REGISTER API HIT"); 
  console.log("BODY 👉", req.body);   

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    // Check duplicate email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log("❌ Email or username already exists");
      return res.status(400).json({ message: "Email or username already exists" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // CREATE user
    const user = await User.create({ username, email, password: hashed });
    console.log("✅ USER SAVED 👉", user); // ✅ confirm user save

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("🔥 LOGIN API HIT"); // ✅ test log
  console.log("BODY 👉", req.body);

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("❌ Missing fields");
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Invalid email");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("✅ LOGIN SUCCESS:", user.username);

    res.json({ token, username: user.username });
  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
