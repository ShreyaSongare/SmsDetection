import "./VerifyOtp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("Session expired. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid OTP");
        return;
      }

      // ✅ STORE USER DATA
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔐 STORE SESSION KEY (MOST IMPORTANT FIX)
      localStorage.setItem("sessionKey", data.sessionKey);

      // 🧹 CLEAN TEMP DATA
      localStorage.removeItem("userId");

      console.log("Session Key stored:", data.sessionKey); // ✅ debug

      // 🚀 Redirect
      navigate("/dashboard");

    } catch (error) {
      console.error("OTP verify error:", error);
      setError("Server not responding");
    }
  };

  return (
    <div className="otp-container">
      <form onSubmit={handleVerify} className="otp-form">
        <h2>Enter OTP</h2>

        <input
          type="text"
          placeholder="Enter 6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Verify OTP</button>
      </form>
    </div>
  );
}