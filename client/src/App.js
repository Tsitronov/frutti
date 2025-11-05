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
import { AuthContext } from "./AuthContext";



function App() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [categoria, setCategoria] = useState(null);

  const response = await api.post('/login', { username, password });
  setTokens(response.data.accessToken, response.data.refreshToken);
  setIsAuth(true);

  const theme = useSelector((state) => state.theme?.theme || 'light');
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);


    // 🔑 Функция логина
  const handleLogin = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      setTokens(response.data.accessToken, response.data.refreshToken);
      setIsAuth(true);
      setCategoria(response.data.categoria);
      navigate('/'); // переход после входа
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  // 🚪 Проверка токена при загрузке страницы
  useEffect(() => {
    // при обновлении страницы пользователь не авторизован, пока не войдёт заново
    setIsAuth(false);
    setCategoria(null);
  }, []);


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