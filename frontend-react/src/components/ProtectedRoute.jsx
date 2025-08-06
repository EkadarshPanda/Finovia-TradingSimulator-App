import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  // Check if a JWT token exists in localStorage
  const token = localStorage.getItem('token');

  // If there's no token, redirect the user to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If there is a token, show the component that this route is protecting
  return children;
}

export default ProtectedRoute;