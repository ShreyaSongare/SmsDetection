import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ NEW STATE (same as signup)
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Login response parse error", parseError);
        data = {};
      }

      if (!response.ok) {
        console.error("Login failed", response.status, data);
        setError(data.message || response.statusText || "Login failed");
        return;
      }

      setError("");

      if (data.sessionKey) {
        localStorage.setItem("sessionKey", data.sessionKey);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
        return;
      }

      if (data.userId) {
        localStorage.setItem("userId", data.userId);
        navigate("/verify-otp");
        return;
      }

      setError("Unexpected login response from server");

    } catch (error) {
      console.log(error);
      setError("Server not responding");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="premium-form">
        
        <h2 className="form-title">Welcome Back 👋</h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD WITH TOGGLE */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="btn-wrapper">
          <button type="submit" className="premium-btn">
            Login
          </button>
        </div>

        <p className="form-footer">
          Don’t have an account?{" "}
          <Link to="/signup">Signup</Link>
        </p>

      </form>
    </div>
  );
}