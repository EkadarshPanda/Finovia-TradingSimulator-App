// At the top of App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { isTokenExpired } from './services/authService';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// ... other imports

function App() {
  const navigate = useNavigate(); // This hook must be inside the Router context

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      // No need to navigate here as ProtectedRoute will handle it.
      // Or you could force navigate('/login') if you prefer.
    }
  }, []);

  // ... rest of the component
}

// To use the useNavigate hook, we need to wrap our App in the Router
// So we will create a small wrapper component.

function AppWrapper() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (isTokenExpired(token)) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, []);

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        <Route 
          path="/" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
      </Routes>
    </div>
  );
}

export default AppWrapper;