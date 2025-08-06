import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './SignupPage.css'; // Import the external CSS file

/**
 * A modern signup page component with a two-panel layout,
 * consistent with the login page design.
 */
function SignupPage() {
  // State for form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State for handling form submission errors and successes
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Handles changes in form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic password length validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      // Send a POST request to the backend's /signup endpoint
      await axios.post('http://localhost:8080/api/signup', formData);

      setSuccess('Registration successful! Redirecting to login...');

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Handle errors from the API
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Panel: Information */}
        <div className="signup-left-panel">
          <h1 className="signup-heading">Discover. Practice. Succeed.</h1>
          <p className="signup-subheading">
            Use our integrated news and screener to find your next trade, then test your strategy risk-free with our paper trading platform. Sign up to get started.
          </p>
          <div className="signup-quote">
            <p>"I started investing at the age of 11. I was late."</p>
            <p className="signup-quote-author">- Warren Buffett</p>
          </div>
        </div>

        {/* Right Panel: Signup Form */}
        <div className="signup-right-panel">
          <div className="signup-form-card" tabIndex={0}>
            <form onSubmit={handleSubmit} className="signup-form">
              {error && <div className="signup-error-message">{error}</div>}
              {success && <div className="signup-success-message">{success}</div>}

              <div className="signup-input-group">
                <label className="signup-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="signup-input"
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>
              <div className="signup-input-group">
                <label className="signup-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="signup-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="signup-input-group">
                <label className="signup-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="signup-input"
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="signup-button">
                CREATE ACCOUNT
              </button>
            </form>
            <p className="signup-login-redirect">
              Already have an account? <Link to="/login" className="signup-link">Login here.</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
