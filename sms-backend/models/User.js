const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    // ================================
    // ✅ EMAIL VERIFICATION
    // ================================
    isVerified: {
      type: Boolean,
      default: false
    },

    verificationToken: String,

    // ================================
    // 🔁 PASSWORD RESET (FUTURE USE)
    // ================================
    resetToken: String,
    resetTokenExpiry: Date,

    // ================================
    // 🔢 OTP LOGIN
    // ================================
    otp: String,
    otpExpiry: Date,

    // ================================
    // 🔐 LOGIN SECURITY (NEW)
    // ================================
    loginAttempts: {
      type: Number,
      default: 0
    },

    lockUntil: {
      type: Date
    },

    // ================================
    // ⚛️ POST-QUANTUM SUPPORT
    // ================================
    kyberPublicKey: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);