import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuth, categoria } = useContext(AuthContext);
  const location = useLocation();

  // Если пользователь не авторизован — отправляем на логин
  if (!isAuth) {
    return <Navigate to="/loginDemo" state={{ from: location }} replace />;
  }

  // Если требуется админ, но категория не 3 — перенаправляем
  if (requireAdmin && String(categoria) !== '3') {
    return <Navigate to="/generaleDemo" replace />;
  }

  return children;
};

export default ProtectedRoute;
