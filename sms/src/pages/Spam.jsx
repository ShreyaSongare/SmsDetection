// Ham.js
import { useEffect, useState } from "react";
import axios from "axios";

export default function Spam() {
  const [spamMessages, setSpamMessages] = useState([]);

  // Fetch Spam messages from the backend
  const fetchSpamMessages = async () => {
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

      // Filter only Spam messages
      const spamOnly = response.data.filter(
        (msg) => msg.prediction === "Spam"
      );

      setSpamMessages(spamOnly);

    } catch (error) {
      console.error("Error fetching Spam messages:", error);
    }
  };

  useEffect(() => {
    fetchSpamMessages();
  }, []);

  // Dynamically add new Spam message
  const handleNewMessage = (msg) => {
    if (msg.prediction === "Spam") {
      setSpamMessages((prev) => [msg, ...prev]);
    }
  };

  return (
    <div className="page">
      <h2>Spam Messages</h2>

      {spamMessages.length === 0 ? (
        <p>No Spam Messages Found</p>
      ) : (
        spamMessages.map((msg) => (
          <div key={msg._id} className="card">
            <p><strong>Sender:</strong> {msg.senderId}</p>
            <p><strong>Message:</strong> {msg.message}</p>
          </div>
        ))
      )}
    </div>
  );
}