import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../assets/spamuria logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu (used for links + overlay)
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Load user whenever route changes
  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem("user"));
  //   setUser(storedUser);

  //   // Close mobile menu automatically on route change
  //   setMenuOpen(false);
  // }, [location.pathname]);

  useEffect(() => {
  try {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  } catch (error) {
    console.log("Invalid user data in localStorage");
    setUser(null);
  }

  setMenuOpen(false);
}, [location.pathname]);
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="brand">
  <img src={logo} alt="Logo" className="logo-img" />
  <span className="logo-text">SPAMURAI</span>
</div>



        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          {/* Always Visible */}
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>

          {/* Show ONLY when logged in */}
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

          {/* If NOT logged in */}
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
            <li className="profile-wrapper">
              <div
                className="profile-icon"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                👤
              </div>

              {dropdownOpen && (
                <div className="profile-dropdown">
                  <p className="profile-name">
                    {user.name || "User"}
                  </p>
                  <p className="profile-email">
                    {user.email}
                  </p>
                  <hr />
                  <button
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </li>
          )}
        </ul>
      </nav>

      {/* Overlay (ONLY when menu open) */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={closeMenu}
        />
      )}
    </>
  );
};

export default Navbar;
