import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import SulSito from './components/pages/SulSito';
import Generale from './components/pages/Generale';
import Appunti from './components/pages/Appunti';
import ImportExcel from './components/pages/ImportExcel';
import Utenti from './components/pages/Utenti';
import UtentiTable from './components/pages/UtentiTable';
import Report from './components/pages/Report';
import Admin from './components/pages/Admin';
import TeamPhotos from './components/pages/TeamPhotos';

import { AuthContext } from './context';
import { useSelector} from 'react-redux';

import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { setTokens } from './api.js';
import api from "./api";



function App() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [categoria, setCategoria] = useState(null);

  const theme = useSelector((state) => state.theme?.theme || 'light');
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);


  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      const response = await api.post('/login', { username, password });
      setTokens(response.data.accessToken, response.data.refreshToken);
      setIsAuth(true);
      setUserCategoria(response.data.categoria);
      navigate('/utentiDemo');
    } catch (err) {
      console.error('Ошибка входа:', err);
      alert('Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Проверяем токен при запуске
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/loginDemo');
    }
  }, [navigate]);


  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, categoria, setCategoria, handleLogin }}>
      <Routes>
        <Route path="/utentiDemo" element={<ProtectedRoute> <Utenti /> </ProtectedRoute>} />
        <Route path="/utentiTable" element={<ProtectedRoute> <UtentiTable /> </ProtectedRoute>} />
        <Route path="/loginDemo" element={<Login />} />
        <Route path="/appuntiDemo" element={<ProtectedRoute> <Appunti /> </ProtectedRoute>} />
        <Route path="/importExcel" element={<ProtectedRoute> <ImportExcel /> </ProtectedRoute>} />
        <Route path="/reportDemo" element={<ProtectedRoute> <Report /> </ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute> <Generale /> </ProtectedRoute>} />
        <Route path="/generaleDemo" element={<ProtectedRoute> <Generale /> </ProtectedRoute>} />
        <Route path="/" element={<SulSito />} />
        <Route index element={<SulSito />} />
        <Route path="*" element={<SulSito />} />
        <Route
          path="/adminDemo"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team-photos"
          element={
            <ProtectedRoute>
              <TeamPhotos />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;