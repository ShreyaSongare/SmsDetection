require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// ================================
// ✅ CONNECT DATABASE
// ================================
connectDB();

// ================================
// 🔐 SECURITY MIDDLEWARE
// ================================

// 🛡️ Secure HTTP headers
app.use(helmet());

// 🌐 Enable CORS (restrict in production)
app.use(cors({
  origin: "http://localhost:3000", // 🔥 change to frontend URL in production
  credentials: true
}));

// 📦 Parse JSON
app.use(express.json());


// ================================
// 📌 ROUTES
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


// ================================
// ❌ GLOBAL ERROR HANDLER
// ================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  res.status(500).json({
    message: "Something went wrong"
  });
});


// ================================
// 🚀 START SERVER
// ================================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});