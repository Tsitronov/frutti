import React, { useState, useEffect, useRef } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import api, { setTokens } from './api.js';

import Login from './components/pages/Login';
import SulSito from './components/pages/SulSito';
import Generale from './components/pages/Generale';
import Appunti from './components/pages/Appunti';
import Articoli from './components/pages/Articoli';
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


  const attemptedRef = useRef(false);

  useEffect(() => {
    const tryRefresh = async () => {
      if (attemptedRef.current) return;
      attemptedRef.current = true;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const res = await fetch('https://frutti-backend.onrender.com/api/refresh', {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          setTokens(data.accessToken);

          const valRes = await fetch('https://frutti-backend.onrender.com/api/validateToken', {
            credentials: 'include',
            headers: { Authorization: `Bearer ${data.accessToken}` }
          });

          if (valRes.ok) {
            const valData = await valRes.json();
            setIsAuth(true);
            setCategoria(Number(valData.categoria));
          }
        }

      } catch (err) {
        console.log("Нет сессии или кука не пришла — идём на логин");
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, []);


  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, categoria, setCategoria, loading, setLoading  }}>
      <Routes>
        <Route path="/" element={<SulSito />} />
        <Route path="/login" element={<Login />} />

        <Route path="/generale" element={<ProtectedRoute><Generale /></ProtectedRoute>} />
        <Route path="/appunti" element={<ProtectedRoute><Appunti /></ProtectedRoute>} />
        <Route path="/articoli" element={<ProtectedRoute><Articoli /></ProtectedRoute>} />
        <Route path="/utenti" element={<ProtectedRoute><Utenti /></ProtectedRoute>} />
        <Route path="/utentiTable" element={<ProtectedRoute><UtentiTable /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/team-photos" element={<ProtectedRoute><TeamPhotos /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><Admin /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;
