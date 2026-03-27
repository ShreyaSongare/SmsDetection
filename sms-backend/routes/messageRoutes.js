// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const quantumSMS = require("../utils/quantumSMS");

// ================= SAVE MESSAGE =================
router.post("/save", async (req, res) => {
  try {
    const { userId, senderId, message, prediction } = req.body;

    console.log("Incoming message to save:", req.body);

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message are required" });
    }

    // 🔐 Get session key from header
    const sessionKey = req.headers["x-session-key"];
    console.log("Session Key from header:", sessionKey); // ✅ DEBUG

    if (!sessionKey) {
      return res.status(400).json({
        error: "Session key required for encryption"
      });
    }

    // 🔐 Encrypt message safely
    let encrypted;
    try {
      encrypted = quantumSMS.encryptSMS(message, sessionKey);
    } catch (err) {
      console.error("Encryption error:", err);
      return res.status(500).json({ error: "Encryption failed" });
    }

    const newMessage = new Message({
      userId,
      senderId: senderId || "unknown",
      message: encrypted.encryptedMessage,
      iv: encrypted.iv,
      prediction: prediction || "unknown",
    });

    const saved = await newMessage.save();

    console.log("✅ Message saved successfully:", saved);

    res.status(201).json({
      message: "Message saved successfully",
      _id: saved._id
    });

  } catch (error) {
    console.error("❌ Failed to save message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
});


// ================= GET USER MESSAGES =================
router.get("/user/:userId", async (req, res) => {
  try {
    const sessionKey = req.headers["x-session-key"];
    console.log("Session Key for decryption:", sessionKey); // ✅ DEBUG

    if (!sessionKey) {
      return res.status(400).json({
        error: "Session key required for decryption"
      });
    }

    const messages = await Message.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    // 🔓 Decrypt messages safely
    const decryptedMessages = messages.map((msg) => {
      try {
        const decryptedText = quantumSMS.decryptSMS(
          msg.message,
          msg.iv,
          sessionKey
        );

        return {
          ...msg._doc,
          message: decryptedText
        };

      } catch (err) {
        console.error("Decryption error:", err);

        return {
          ...msg._doc,
          message: "⚠️ Unable to decrypt"
        };
      }
    });

    res.status(200).json(decryptedMessages);

  } catch (error) {
    console.error("❌ Failed to fetch messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;