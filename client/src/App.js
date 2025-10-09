import React, { useState } from 'react';
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
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('auth'));
  const [userCategoria, setUserCategoria] = useState(localStorage.getItem('userCategoria') || null);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, userCategoria, setUserCategoria }}>
      <Routes>
        <Route path="/utentiDemo" element={<ProtectedRoute><Utenti /></ProtectedRoute>} />
        <Route path="/utentiTable" element={<ProtectedRoute><UtentiTable /></ProtectedRoute>} />
        <Route path="/loginDemo" element={<Login />} />
        <Route path="/appuntiDemo" element={<ProtectedRoute><Appunti /></ProtectedRoute>} />
        <Route path="/importExcel" element={<ProtectedRoute><ImportExcel /></ProtectedRoute>} />
        <Route path="/reportDemo" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Generale /></ProtectedRoute>} />
        <Route path="/generaleDemo" element={<ProtectedRoute><Generale /></ProtectedRoute>} />
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