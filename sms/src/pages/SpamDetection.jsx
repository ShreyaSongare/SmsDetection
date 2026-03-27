// SpamDetection.js
import axios from "axios";
import { useState } from "react";

function SpamDetection({ onNewMessage }) {
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [linkPresent, setLinkPresent] = useState(0);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    try {
      // 🔹 Call ML API
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        message,
        sender_id: senderId,
        link_present: linkPresent
      });

      setResult(response.data);

      // 🔹 Get user + sessionKey
      const user = JSON.parse(localStorage.getItem("user"));
      const sessionKey = localStorage.getItem("sessionKey");

      // ❗ Safety check
      if (!user || !user._id) {
        console.error("User not found");
        return;
      }

      if (!sessionKey) {
        console.error("Session key missing");
        return;
      }

      // 🔐 Save message (ENCRYPTION happens in backend)
      const saveRes = await axios.post(
        "http://127.0.0.1:5001/api/messages/save",
        {
          userId: user._id,
          senderId,
          message,
          prediction: response.data.prediction
        },
        {
          headers: {
            "x-session-key": sessionKey
          }
        }
      );

      // 🔄 Refresh UI
      if (onNewMessage) {
        onNewMessage({
          _id: saveRes.data._id,
          senderId,
          message,
          prediction: response.data.prediction
        });
      }

    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div>
      <h2>Spam Detection</h2>

      <textarea
        placeholder="Enter SMS"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="text"
        placeholder="Sender ID"
        value={senderId}
        onChange={(e) => setSenderId(e.target.value)}
      />

      <select onChange={(e) => setLinkPresent(Number(e.target.value))}>
        <option value={0}>No Link</option>
        <option value={1}>Contains Link</option>
      </select>

      <button onClick={handlePredict}>Predict</button>

      {result && (
        <div>
          <h3>Result: {result.prediction}</h3>
          <p>Confidence: {result.confidence}%</p>
        </div>
      )}
    </div>
  );
}

export default SpamDetection;