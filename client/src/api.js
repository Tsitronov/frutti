// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🚀 Добавляем перехватчик (interceptor)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 🔁 Перехватчик ответов — обновляет accessToken при 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если токен истёк и запрос ещё не был повторён
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.warn('⚠️ Нет refreshToken — нужно заново войти');
        return Promise.reject(error);
      }

      try {
        // Запрашиваем новый accessToken
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/refresh`, { refreshToken });

        // Сохраняем новый токен
        localStorage.setItem('token', res.data.accessToken);

        // Обновляем заголовок и повторяем исходный запрос
        originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Ошибка обновления токена', refreshError);
        // Удаляем токены и перенаправляем на логин
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
