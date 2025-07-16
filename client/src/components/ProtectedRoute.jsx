import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context';

const ProtectedRoute = ({ children }) => {
  const { isAuth } = useContext(AuthContext);

  // Если пользователь не авторизован, перенаправить на страницу логина
  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  // Если пользователь авторизован, отобразить дочерние элементы
  return children;
};

export default ProtectedRoute;