const express = require("express");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const transporter = require("../utils/sendEmail");
const argon2 = require("argon2");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const { admin } = require("../config/firebase"); // 🔥 Firebase Admin

const PEPPER = process.env.PEPPER;
const db = admin.firestore(); // Firestore database
const auth = admin.auth(); // Firebase Authentication

// ================================
// 🔐 RATE LIMITER (LOGIN PROTECTION)
// ================================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 50,                    // ✅ Increased to 50 for development
  message: "Too many login attempts. Try again later."
});


// ================================
// ✅ SIGNUP (WITH VALIDATION ADDED)
// ================================
router.post(
  "/signup",

  // 🔥 VALIDATION RULES
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

  async (req, res) => {
    try {
      console.log("\n🔍 SIGNUP REQUEST RECEIVED");
      console.log("📦 Request body:", req.body);
      
      // 🔥 HANDLE VALIDATION ERRORS
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("❌ Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;
      console.log("✅ Validation passed for:", { name, email });

      // (your existing check - kept)
      if (!password || password.length < 8) {
        console.log("❌ Password too short");
        return res.status(400).json({
          message: "Password must be at least 8 characters"
        });
      }

      console.log("🔍 Checking if user already exists...");
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("❌ User already exists:", email);
        return res.status(400).json({ message: "Email already exists" });
      }
      console.log("✅ User is new, proceeding...");

      const hashedPassword = await argon2.hash(password + PEPPER);
      console.log("🔐 Password hashed successfully");

      // 🔥 Create user in Firebase Authentication
      console.log("🔥 Creating user in Firebase Auth...");
      let firebaseUser;
      try {
        firebaseUser = await auth.createUser({
          email: email,
          password: password,
          displayName: name
        });
        console.log("✅ Firebase user created:", firebaseUser.uid);
      } catch (firebaseError) {
        console.error("❌ Firebase Auth error:", firebaseError.message);
        return res.status(400).json({ message: "Email already registered in Firebase" });
      }

      // Create MongoDB user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        firebaseUid: firebaseUser.uid,
        isVerified: false
      });
      console.log("📝 New user object created");

      console.log("💾 Saving user to MongoDB...");
      const savedUser = await newUser.save();
      console.log("✅ User saved successfully:", savedUser._id);

      // 🔥 Send verification email using Firebase
      console.log("🔥 Sending verification email via Firebase...");
      try {
        const verificationLink = await auth.generateEmailVerificationLink(email);
        console.log("📧 Verification link generated");

        await transporter.sendMail({
          from: "yourgmail@gmail.com",
          to: email,
          subject: "Verify Your Email",
          html: `
            <h3>Email Verification</h3>
            <p>Click below to verify your email:</p>
            <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          `
        });
        console.log("✅ Verification email sent successfully");
      } catch (firebaseError) {
        console.error("❌ Firebase email error:", firebaseError.message);
        // Don't fail signup just because email sending failed
      }

      res.status(201).json({
        message: "Signup successful. Check your email to verify account.",
        firebaseUid: firebaseUser.uid,
        action: "signup"
      });

    } catch (error) {
      console.error("\n❌ SIGNUP ERROR:", error.message);
      console.error("📍 Error stack:", error.stack);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);


// ================================
// ✅ VERIFY EMAIL (FIREBASE VERIFICATION)
// ================================
router.get("/verify-email", async (req, res) => {
  try {
    console.log("\n📧 VERIFY EMAIL REQUEST");
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).send(`
        <html>
          <body style="text-align: center; font-family: Arial; margin-top: 50px;">
            <h2 style="color: red;">❌ Email parameter required</h2>
            <p>Please provide an email address.</p>
          </body>
        </html>
      `);
    }

    console.log("🔥 Checking Firebase email verification for:", email);
    try {
      const firebaseUser = await auth.getUserByEmail(email);
      console.log("✅ Firebase user found:", firebaseUser.uid);

      if (firebaseUser.emailVerified) {
        console.log("✅ Email already verified in Firebase");
        
        // Update MongoDB
        const user = await User.findOne({ email });
        if (user) {
          user.isVerified = true;
          await user.save();
        }

        return res.send(`
          <html>
            <body style="text-align: center; font-family: Arial; margin-top: 50px;">
              <h2 style="color: green;">✅ Email Verified Successfully!</h2>
              <p>Your email has been verified. You can now login to your account.</p>
              <a href="http://localhost:3000/login" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Go to Login</a>
            </body>
          </html>
        `);
      } else {
        console.log("❌ Email not yet verified in Firebase");
        return res.send(`
          <html>
            <body style="text-align: center; font-family: Arial; margin-top: 50px;">
              <h2 style="color: orange;">⏳ Email Not Verified Yet</h2>
              <p>Please check your email and click the verification link.</p>
              <a href="http://localhost:3000/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Login</a>
            </body>
          </html>
        `);
      }
    } catch (firebaseError) {
      console.error("❌ Firebase error:", firebaseError.message);
      return res.status(400).send(`
        <html>
          <body style="text-align: center; font-family: Arial; margin-top: 50px;">
            <h2 style="color: red;">❌ User not found</h2>
            <p>Invalid email address.</p>
          </body>
        </html>
      `);
    }

  } catch (error) {
    console.error("❌ Verify email error:", error.message);
    res.status(500).send(`
      <html>
        <body style="text-align: center; font-family: Arial; margin-top: 50px;">
          <h2 style="color: red;">❌ Server Error</h2>
          <p>Something went wrong. Please try again later.</p>
        </body>
      </html>
    `);
  }
});


// ================================
// ✅ LOGIN (WITH VALIDATION ADDED)
// ================================
router.post(
  "/login",
  loginLimiter,

  // 🔥 VALIDATION RULES
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req, res) => {
    try {
      // 🔥 HANDLE VALIDATION ERRORS
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      // 🔥 Check if email is verified in Firebase
      console.log("🔥 Checking Firebase email verification...");
      try {
        const firebaseUser = await auth.getUserByEmail(email);
        console.log("📧 Firebase user found. Email verified:", firebaseUser.emailVerified);

        if (!firebaseUser.emailVerified) {
          console.log("❌ Email not verified in Firebase");
          return res.status(400).json({
            message: "Please verify your email first. Check your inbox for the verification link."
          });
        }

        // Update MongoDB just in case
        user.isVerified = true;
      } catch (firebaseError) {
        console.error("❌ Firebase check error:", firebaseError.message);
        return res.status(400).json({ message: "Email verification check failed" });
      }

      if (user.lockUntil && user.lockUntil > Date.now()) {
        return res.status(403).json({
          message: "Account locked. Try again later."
        });
      }

      const isMatch = await argon2.verify(
        user.password,
        password + PEPPER
      );

      if (!isMatch) {
        user.loginAttempts = (user.loginAttempts || 0) + 1;

        if (user.loginAttempts >= 5) {
          user.lockUntil = Date.now() + 15 * 60 * 1000;
        }

        await user.save();

        return res.status(400).json({ message: "Invalid password" });
      }

      user.loginAttempts = 0;
      user.lockUntil = null;

      // 🔥 Generate OTP for 2FA
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

      console.log("🔥 Storing OTP in Firebase Firestore...");
      try {
        await db.collection("otps").doc(user._id.toString()).set({
          otp: otp,
          email: user.email,
          expiresAt: new Date(otpExpiry),
          createdAt: new Date(),
          verified: false
        });
        console.log("✅ OTP stored in Firebase");
      } catch (firebaseError) {
        console.error("❌ Firebase error:", firebaseError);
        return res.status(500).json({ message: "Failed to generate OTP" });
      }

      // Also store in MongoDB for backup
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
      console.log("✅ OTP stored in MongoDB");

      // 📧 Send OTP via email
      console.log("📧 Sending OTP to email...");
      try {
        await transporter.sendMail({
          from: "yourgmail@gmail.com",
          to: user.email,
          subject: "Your Login OTP",
          html: `<h3>Your OTP: ${otp}</h3><p>Valid for 5 minutes</p><p>Do not share this OTP with anyone.</p>`
        });
        console.log("✅ OTP sent to email");
      } catch (emailError) {
        console.error("❌ Email error:", emailError.message);
        // Still proceed even if email fails
      }

      // Return userId - user must verify OTP next
      res.status(200).json({
        message: "OTP sent to your email",
        userId: user._id
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================================
// ✅ VERIFY OTP (2FA VERIFICATION)
// ================================
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("\n🔍 OTP VERIFICATION REQUEST");
    const { userId, otp } = req.body;
    console.log("📝 Received - UserID:", userId, "OTP:", otp);

    const user = await User.findById(userId);

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 Verify OTP with Firebase Firestore
    console.log("🔥 Verifying OTP with Firebase...");
    try {
      const otpDoc = await db.collection("otps").doc(userId).get();

      if (!otpDoc.exists) {
        console.log("❌ OTP record not found in Firebase");
        return res.status(400).json({ message: "OTP expired or not found" });
      }

      const otpData = otpDoc.data();
      console.log("📊 Firebase OTP data:", { 
        storedOTP: otpData.otp, 
        receivedOTP: otp,
        verified: otpData.verified 
      });

      // Check if already verified
      if (otpData.verified) {
        console.log("⚠️ OTP already verified");
        return res.status(400).json({ message: "OTP already verified" });
      }

      // Verify OTP matches
      if (String(otpData.otp) !== String(otp)) {
        console.log("❌ OTP mismatch");
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Check expiry
      if (otpData.expiresAt.toDate() < new Date()) {
        console.log("❌ OTP expired");
        return res.status(400).json({ message: "OTP expired" });
      }

      // Mark as verified in Firebase
      console.log("✅ OTP verified! Updating Firebase...");
      await db.collection("otps").doc(userId).update({
        verified: true,
        verifiedAt: new Date()
      });

      // Clear OTP from MongoDB
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      // Generate session key
      const sessionKey = crypto.randomBytes(32).toString("hex");
      console.log("🔐 Session Key generated");

      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        sessionKey,
        action: "login"
      });

    } catch (firebaseError) {
      console.error("❌ Firebase verification error:", firebaseError);
      return res.status(500).json({ message: "Verification failed" });
    }

  } catch (error) {
    console.error("\n❌ OTP VERIFY ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;