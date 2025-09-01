import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuth, userCategoria } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requireAdmin && String(userCategoria) !== '3') {
    return <Navigate to="/generale" />;
  }

  return children;
};

export default ProtectedRoute;