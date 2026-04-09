import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from './context';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import { setTokens } from './api.js';
import CookieBanner from './components/UI/CookieBanner';
import ErrorBoundary from './components/ErrorBoundary';

const Login = lazy(() => import('./components/pages/Login'));
const SulSito = lazy(() => import('./components/pages/SulSito'));
const Generale = lazy(() => import('./components/pages/Generale'));
const Appunti = lazy(() => import('./components/pages/Appunti'));
const Articoli = lazy(() => import('./components/pages/Articoli'));
const Utenti = lazy(() => import('./components/pages/Utenti'));
const UtentiTable = lazy(() => import('./components/pages/UtentiTable'));
const Report = lazy(() => import('./components/pages/Report'));
const Admin = lazy(() => import('./components/pages/Admin'));
const TeamPhotos = lazy(() => import('./components/pages/TeamPhotos'));
const PrivacyPolicy = lazy(() => import('./components/pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./components/pages/TermsConditions'));

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

        const apiUrl = process.env.REACT_APP_API_URL || '';

        const res = await fetch(`${apiUrl}/api/refresh`, {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal
        });

        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          setTokens(data.accessToken);

          const valRes = await fetch(`${apiUrl}/api/validateToken`, {
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
    <ErrorBoundary>
      <AuthContext.Provider value={{ isAuth, setIsAuth, categoria, setCategoria, loading, setLoading }}>
        <CookieBanner />
        <Suspense fallback={<div className="loading-screen"><div className="loading-spinner"></div></div>}>
        <Routes>
          <Route path="/" element={<SulSito />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />

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
        </Suspense>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;
