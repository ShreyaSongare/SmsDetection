import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/spamuria logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ NEW REF
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // 🌙 Dark Mode
  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);

    if (newTheme) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  // Load user safely
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Invalid user data");
      setUser(null);
    }

    setMenuOpen(false);
  }, [location.pathname]);

  // ✅ NEW: CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">

        {/* LEFT - LOGO */}
        <div className="brand">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="logo-text">SPAMURAI</span>
        </div>

        {/* RIGHT SIDE */}
        <div className="nav-right">

          {/* NAV LINKS */}
          <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
            
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>

            {user && (
              <>
                <li>
                  <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/spam" onClick={closeMenu}>Spam</Link>
                </li>
                <li>
                  <Link to="/harm" onClick={closeMenu}>Safe</Link>
                </li>
              </>
            )}

            {!user ? (
              <>
                <li>
                  <Link to="/login" onClick={closeMenu}>Login</Link>
                </li>
                <li>
                  <Link to="/signup" onClick={closeMenu}>Signup</Link>
                </li>
              </>
            ) : (
              <li
                ref={profileRef} // ✅ ATTACHED HERE
                className={`profile-wrapper ${dropdownOpen ? "active" : ""}`}
              >
                <div
                  className="profile-icon"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  👤
                </div>

                <div className="profile-dropdown">
                  <p className="profile-name">{user.name || "User"}</p>
                  <p className="profile-email">{user.email}</p>
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </li>
            )}
          </ul>

       

        </div>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="overlay" onClick={closeMenu}></div>
      )}
    </>
  );
};

export default Navbar;