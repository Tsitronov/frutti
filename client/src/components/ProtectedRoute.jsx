import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuth, categoria } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (requireAdmin && Number(categoria) !== 3) {
    return <Navigate to="/generale" replace />;
  }

  return children;
};

export default ProtectedRoute;
