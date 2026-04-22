const admin = require("firebase-admin");

// 🔐 Replace with your downloaded service account JSON
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "spamurai-s"
});

const auth = admin.auth();

module.exports = { admin, auth };
