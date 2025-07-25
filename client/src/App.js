import React, { useState, useContext } from 'react';
import {Route, Routes} from 'react-router-dom';


import Login from './components/pages/Login';

import Generale from './components/pages/Generale';
import Utenti from './components/pages/Utenti';
import { AuthContext } from './context';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('auth'));
  return (
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            <Routes>
              <Route path = "/utenti" element = {<ProtectedRoute> <Utenti /> </ProtectedRoute>} />
              <Route path = "/login" element = {<Login />} />
              <Route path = "/" element = {<Generale />} />
              <Route path = "/generale" element = {<Generale />} />
              <Route index element = {<Generale />} />
              <Route path = "*" element = {<Generale />} />
            </Routes>
      </AuthContext.Provider>
  );
}

export default App;
