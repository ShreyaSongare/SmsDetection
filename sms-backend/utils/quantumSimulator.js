const crypto = require("crypto");

// ============================
// Simulated Kyber Key Exchange
// ============================

function generateClientKeys() {
  const ecdh = crypto.createECDH("secp256k1");
  ecdh.generateKeys();

  return {
    publicKey: ecdh.getPublicKey("base64"),
    privateKey: ecdh.getPrivateKey("base64")
  };
}

function serverEncapsulate(clientPublicKey) {
  const server = crypto.createECDH("secp256k1");
  server.generateKeys();

  const sharedSecret = server.computeSecret(
    Buffer.from(clientPublicKey, "base64")
  );

  const sessionKey = crypto
    .createHash("sha256")
    .update(sharedSecret)
    .digest("hex");

  return {
    sessionKey,
    serverPublicKey: server.getPublicKey("base64")
  };
}

// ============================
// Simulated Dilithium Signature
// ============================

function generateSignatureKeys() {
  return crypto.generateKeyPairSync("ed25519");
}

function signToken(token, privateKey) {
  return crypto
    .sign(null, Buffer.from(token), privateKey)
    .toString("base64");
}

function verifyToken(token, signature, publicKey) {
  return crypto.verify(
    null,
    Buffer.from(token),
    publicKey,
    Buffer.from(signature, "base64")
  );
}

module.exports = {
  generateClientKeys,
  serverEncapsulate,
  generateSignatureKeys,
  signToken,
  verifyToken
};