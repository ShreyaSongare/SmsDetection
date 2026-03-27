const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const transporter = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");


// ================================
// ✅ SIGNUP
// ================================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 🔐 Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    await newUser.save();

    const verificationLink = `http://localhost:5001/api/auth/verify-email?token=${verificationToken}`;

    // 📧 Send email
    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: email,
      subject: "Verify Your Email",
      html: `
        <h3>Email Verification</h3>
        <p>Click below:</p>
        <a href="${verificationLink}">Verify Email</a>
      `
    });

    res.status(201).json({
      message: "Signup successful. Check email to verify account."
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================================
// ✅ VERIFY EMAIL
// ================================
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired token");
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.send("Email verified successfully. You can login now.");

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});


// ================================
// ✅ LOGIN (SEND OTP)
// ================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Verify your email first"
      });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔢 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // 📧 Send OTP
    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: user.email,
      subject: "Your OTP",
      html: `<h3>Your OTP: ${otp}</h3>`
    });

    res.status(200).json({
      message: "OTP sent",
      userId: user._id   // ✅ used in frontend
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================================
// ✅ VERIFY OTP (FINAL LOGIN)
// ================================
router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.otp || String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ✅ Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // ================================
    // 🔐 SESSION KEY GENERATION
    // ================================
    const sessionKey = crypto.randomBytes(32).toString("hex");

    console.log("🔐 Session Key:", sessionKey);

    // ================================
    // ✅ FINAL RESPONSE (FIXED)
    // ================================
    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      sessionKey   // 🔥 CRITICAL FIX
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;