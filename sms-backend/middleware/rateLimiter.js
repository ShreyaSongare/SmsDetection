const rateLimit = require("express-rate-limit");

// 🔐 Limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts
  message: "Too many login attempts. Try again later."
});

module.exports = { loginLimiter };