const express = require("express");
const router = express.Router();
// const SMS = require("../models/SMS");
const quantumSMS = require("../utils/quantumSMS");

// Send SMS
router.post("/send", async (req, res) => {

  const { userId, message, sessionKey } = req.body;

  const encrypted = quantumSMS.encryptSMS(
    message,
    sessionKey
  );

  const sms = new SMS({
    userId,
    encryptedMessage: encrypted.encryptedMessage,
    iv: encrypted.iv
  });

  await sms.save();

  res.json({
    message: "SMS stored securely (Quantum Protected)"
  });

});

// View SMS
router.post("/view", async (req, res) => {

  const { smsId, sessionKey } = req.body;

  const sms = await SMS.findById(smsId);

  const decrypted = quantumSMS.decryptSMS(
    sms.encryptedMessage,
    sms.iv,
    sessionKey
  );

  res.json({
    message: decrypted
  });

});

module.exports = router;