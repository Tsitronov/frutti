import { createContext } from 'react';

export const AuthContext = createContext({
  isAuth: false,
  setIsAuth: () => {},
  categoria: null,
  setCategoria: () => {},
  token: null,
  setToken: () => {},
  refreshToken: null,
  setRefreshToken: () => {}
});