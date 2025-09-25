import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuth, userCategoria } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/loginDemo" state={{ from: location }} replace />;
  }

  if (requireAdmin && String(userCategoria) !== '3') {
    return <Navigate to="/generaleDemo" replace />;
  }

  return children;
};

export default ProtectedRoute;