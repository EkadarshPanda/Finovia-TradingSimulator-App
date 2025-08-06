import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // This function will run when the logout button is clicked
  const handleLogout = () => {
    // Hide the modal first
    setShowLogoutConfirm(false);
    // Remove the token from local storage
    localStorage.removeItem('token');
    // Clear any stored messages
    localStorage.removeItem('loginMessage');
    localStorage.removeItem('signupMessage');
    // Redirect the user to the login page
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Check if a token exists to determine if the user is logged in
  const isLoggedIn = !!localStorage.getItem('token');

  // Clean up modal state when user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedIn]);

  return (
    <header>
      <nav>
        <div className="logo">FINOVIA</div>
        {/* Only show the Logout button if the user is logged in */}
        {isLoggedIn && (
          <button onClick={handleLogoutClick} className="logout-button">
            Logout
          </button>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="logout-modal-buttons">
              <button onClick={handleLogout} className="logout-confirm-btn">
                Yes, Logout
              </button>
              <button onClick={handleCancelLogout} className="logout-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;