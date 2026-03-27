import { createContext, useState } from "react";

export const SmsContext = createContext();

export const SmsProvider = ({ children }) => {
  const [spamMessages, setSpamMessages] = useState([]);
  const [harmMessages, setHarmMessages] = useState([]);

  const detectSms = async (text, senderId = "") => {
    try {
      // 1️⃣ Call ML server
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sender_id: senderId,
          link_present: text.includes("http") ? 1 : 0,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return data.error || "Server error";
      }

      // 2️⃣ Get user + sessionKey
      const user = JSON.parse(localStorage.getItem("user"));
      const sessionKey = localStorage.getItem("sessionKey");

      if (!user || !user._id) {
        console.error("❌ User not found");
        return;
      }

      if (!sessionKey) {
        console.error("❌ Session key missing");
        return;
      }

      console.log("✅ Sending sessionKey:", sessionKey); // debug

      // 3️⃣ Save to backend (FIXED)
      const saveResponse = await fetch(
        "http://127.0.0.1:5001/api/messages/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-session-key": sessionKey, // 🔥 IMPORTANT
          },
          body: JSON.stringify({
            userId: user._id,
            senderId,
            message: text,
            prediction: data.prediction,
          }),
        }
      );

      const saveData = await saveResponse.json();

      if (!saveResponse.ok) {
        console.error("❌ Save failed:", saveData);
      } else {
        console.log("✅ Message saved:", saveData);
      }

      // 4️⃣ Update UI
      if (data.prediction === "Spam") {
        setSpamMessages((prev) => [...prev, text]);
      } else {
        setHarmMessages((prev) => [...prev, text]);
      }

      return `${data.prediction} (${data.confidence}%)`;

    } catch (error) {
      console.error("❌ Error:", error);
      return "Error connecting to server";
    }
  };

  return (
    <SmsContext.Provider value={{ spamMessages, harmMessages, detectSms }}>
      {children}
    </SmsContext.Provider>
  );
};