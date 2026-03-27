import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setError("");

      // ✅ Store userId temporarily (NOT full user)
      localStorage.setItem("userId", data.userId);

      // ✅ Navigate to OTP page
      navigate("/verify-otp");

    } catch (error) {
      console.log(error);
      setError("Server not responding");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button type="submit">Login</button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "blue" }}>
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}