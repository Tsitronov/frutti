import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import api from './api.js';
import { setTokens } from './api.js';


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

import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);

  const theme = useSelector((state) => state.theme?.theme || 'light');
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);


  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/api/validateToken');
        setIsAuth(true);
        setCategoria(response.data.categoria);
      } catch (err) {
        console.warn('Token check failed:', err);
        setIsAuth(false);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);


  if (loading) {
    return (<div className="loading-screen"> <div className="loading-spinner"></div></div>);
  }

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, categoria, setCategoria }}>
      <Routes>
        <Route path="/" element={<SulSito />} />
        <Route path="/login" element={<Login />} />

        <Route path="/generale" element={<ProtectedRoute><Generale /></ProtectedRoute>} />
        <Route path="/appunti" element={<ProtectedRoute><Appunti /></ProtectedRoute>} />
        <Route path="/utenti" element={<ProtectedRoute><Utenti /></ProtectedRoute>} />
        <Route path="/utentiTable" element={<ProtectedRoute><UtentiTable /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/importExcel" element={<ProtectedRoute><ImportExcel /></ProtectedRoute>} />
        <Route path="/team-photos" element={<ProtectedRoute><TeamPhotos /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
