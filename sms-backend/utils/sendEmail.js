const nodemailer = require("nodemailer");

// Create transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "spamurai3@gmail.com",      // ✅ your real gmail
    pass: "xlrmlkedbrlvalxl"          // ✅ your 16-digit app password (NO spaces)
  }
});

module.exports = transporter;