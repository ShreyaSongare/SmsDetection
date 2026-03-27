// Ham.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Harm() {
  const [hamMessages, setHamMessages] = useState([]);

  // Fetch Ham messages from the backend
  const fetchHamMessages = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const sessionKey = localStorage.getItem("sessionKey"); // 🔐 ADD THIS

      if (!user || !user._id) {
        console.error("User not found in localStorage. Cannot fetch messages.");
        return;
      }

      if (!sessionKey) {
        console.error("Session key missing");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:5001/api/messages/user/${user._id}`, // ✅ FIXED URL
        {
          headers: {
            "x-session-key": sessionKey // 🔥 IMPORTANT
          }
        }
      );

      // Filter only Safe messages
      const hamOnly = response.data.filter(
        (msg) => msg.prediction === "Safe"
      );

      setHamMessages(hamOnly);

    } catch (error) {
      console.error("Error fetching Ham messages:", error);
    }
  };

  useEffect(() => {
    fetchHamMessages();
  }, []);

  // Dynamically add new Safe message
  const handleNewMessage = (msg) => {
    if (msg.prediction === "Safe") {
      setHamMessages((prev) => [msg, ...prev]);
    }
  };

  return (
    <div className="page">
      <h2>Safe Messages</h2>

      {hamMessages.length === 0 ? (
        <p>No Safe Messages Found</p>
      ) : (
        hamMessages.map((msg) => (
          <div key={msg._id} className="card">
            <p><strong>Sender:</strong> {msg.senderId}</p>
            <p><strong>Message:</strong> {msg.message}</p>
          </div>
        ))
      )}
    </div>
  );
}