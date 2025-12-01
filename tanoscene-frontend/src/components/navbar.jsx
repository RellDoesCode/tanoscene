import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authprovider.jsx";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(prev => !prev);

  const handleLogout = () => {
    authLogout(); // clears context and localStorage
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Left: Logo */}
      <div className="navbar-left">
        <Link to="/" className="logo">
          TanoScene
        </Link>
      </div>

      {/* Right: User menu */}
      <div className="navbar-right">
        {user ? (
          <div className="profile-section">
            <button className="profile-button" onClick={toggleDropdown}>
              Hi, {user.username}
            </button>

            <div className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                Profile
              </Link>
              <Link to="/settings" onClick={() => setDropdownOpen(false)}>
                Settings
              </Link>
              <Link to="/faq" onClick={() => setDropdownOpen(false)}>
                FAQ
              </Link>
              <Link to="/about" onClick={() => setDropdownOpen(false)}>
                About
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-btn">
              Login
            </Link>
            <Link to="/signup" className="nav-btn">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
