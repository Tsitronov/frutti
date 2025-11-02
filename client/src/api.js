// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ✅ Добавляем accessToken к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Обработка ошибок
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // --- Если токен просрочен (401) ---
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.warn('⚠️ Нет refreshToken — перенаправление на /login');
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Пробуем обновить accessToken
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/refresh`, { refreshToken });
        const newToken = res.data.accessToken;

        if (newToken) {
          localStorage.setItem('token', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest); // повторяем запрос
        } else {
          console.warn('⚠️ refresh не вернул токен — вход снова');
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('Ошибка refresh-токена:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // --- Если сервер отвечает 403 (нет доступа) ---
    if (error.response && error.response.status === 403) {
      console.warn('🚫 403 Forbidden — перенаправление на /login');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

