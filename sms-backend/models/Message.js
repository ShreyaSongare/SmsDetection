const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderId: String,
    message: String,
    iv: String, // ✅ ADD THIS
    prediction: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
