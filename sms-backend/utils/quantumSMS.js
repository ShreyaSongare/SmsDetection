const crypto = require("crypto");

// Encrypt SMS
function encryptSMS(message, sessionKey) {

  const key = Buffer.from(sessionKey, "hex").slice(0, 32);

  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    key,
    iv
  );

  let encrypted = cipher.update(message, "utf8", "base64");

  encrypted += cipher.final("base64");

  return {
    encryptedMessage: encrypted,
    iv: iv.toString("hex")
  };
}

// Decrypt SMS
function decryptSMS(encryptedMessage, iv, sessionKey) {

  const key = Buffer.from(sessionKey, "hex").slice(0, 32);

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(iv, "hex")
  );

  let decrypted = decipher.update(
    encryptedMessage,
    "base64",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports = {
  encryptSMS,
  decryptSMS
};