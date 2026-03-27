const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,

  email: { 
    type: String, 
    unique: true 
  },

  password: String,

  isVerified: { 
    type: Boolean, 
    default: false 
  },

  verificationToken: String,
  resetToken: String,
  resetTokenExpiry: Date,

  otp: String,
  otpExpiry: Date,

  // ✅ NEW FIELD ADDED (Post-Quantum Support)
  kyberPublicKey: {
    type: String,
    required: false   // keep false so old users don't break
  }

});

module.exports = mongoose.model("User", UserSchema);