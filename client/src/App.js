import React, { useState, useContext } from 'react';
import {Route, Routes} from 'react-router-dom';


import Login from './components/pages/Login';

import Esercizio from './components/pages/Esercizio';
import Utenti from './components/pages/Utenti';
import { AuthContext } from './context';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('auth'));
  return (
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            <Routes>
              <Route path = "/utenti" element = {<Utenti />} />
              <Route path = "/login" element = {<Login />} />
              <Route path = "/" element = {<Login />} />
              <Route path = "/esercizio" element = {<ProtectedRoute> <Esercizio /> </ProtectedRoute>} />
              <Route index element = {<Login />} />
              <Route path = "*" element = {<Login />} />
            </Routes>
      </AuthContext.Provider>
  );
}

export default App;
