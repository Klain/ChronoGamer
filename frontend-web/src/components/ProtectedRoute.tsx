import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState(isAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthStatus(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return authStatus ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
