import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import Generale from './components/pages/Generale';
import Appunti from './components/pages/Appunti';
import Utenti from './components/pages/Utenti';
import Report from './components/pages/Report';
import Admin from './components/pages/Admin';
import { AuthContext } from './context';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('auth'));
  const [userCategoria, setUserCategoria] = useState(localStorage.getItem('userCategoria') || null);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, userCategoria, setUserCategoria }}>
      <Routes>
        <Route path="/utentiDemo" element={<Utenti />} />
        <Route path="/loginDemo" element={<Login />} />
        <Route path="/appuntiDemo" element={<ProtectedRoute><Appunti /></ProtectedRoute>} />
        <Route path="/reportDemo" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/generaleDemo" element={<ProtectedRoute><Generale /></ProtectedRoute>} />
        <Route index element={<ProtectedRoute><Generale /></ProtectedRoute>} />
        <Route
          path="/adminDemo"
          element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default App;