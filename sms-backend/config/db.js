const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("📍 Connection URI:", mongoUri ? "✅ Loaded from .env" : "❌ NOT FOUND");
    
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in .env file");
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
