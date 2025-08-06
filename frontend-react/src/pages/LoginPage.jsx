import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Import the external CSS file

/**
 * A modern login page component with a two-panel layout,
 * consistent with the signup page design.
 */
function LoginPage() {
  // State to hold the form data (username and password)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // State to hold any login errors
  const [error, setError] = useState('');

  // Hook to programmatically navigate to other pages
  const navigate = useNavigate();

  /**
   * Updates the form data state as the user types in the input fields.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Handles the form submission by sending credentials to the backend.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setError(''); // Clear previous errors

    try {
      // Send a POST request to the backend's /signin endpoint
      const response = await axios.post('http://localhost:8080/api/signin', formData);

      // If login is successful, the backend sends back a token
      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        // Redirect the user to the dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      // If there's an error (e.g., wrong password), display an error message
      setError('Invalid username or password.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Panel: Information */}
        <div className="login-left-panel">
          <h1 className="login-heading">Your Dashboard Awaits.</h1>
          <p className="login-subheading">
            Log in to pick up where you left off. Analyze, practice, and execute your trading plan with confidence. Welcome back.
          </p>
          <div className="login-quote">
            <p>"The stock market is a device for transferring money from the impatient to the patient."</p>
            <p className="login-quote-author">- Warren Buffett</p>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="login-right-panel">
          <div className="login-form-card" tabIndex={0}>
            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="login-error-message">{error}</div>}

              <div className="login-input-group">
                <label className="login-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="login-input"
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </div>
              <div className="login-input-group">
                <label className="login-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="login-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="login-button">
                LOGIN
              </button>
            </form>
            <p className="login-signup-redirect">
              Don't have an account? <Link to="/signup" className="login-link">Sign up here.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
