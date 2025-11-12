// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, handleUnauthenticated }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    handleUnauthenticated();
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
