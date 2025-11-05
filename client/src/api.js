// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

let accessToken = null;
let refreshToken = null;

export const setTokens = (newAccess, newRefresh) => {
  accessToken = newAccess;
  refreshToken = newRefresh;
};

// ✅ Перехватчик запросов
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// 🔁 Перехватчик ответов
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!refreshToken) {
        console.warn('⚠️ Нет refreshToken — перенаправляем на loginDemo');
        window.location.href = '/loginDemo';
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/refresh`, { refreshToken });
        accessToken = res.data.accessToken;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        window.location.href = '/loginDemo';
      }
    }

    if (error.response && error.response.status === 403) {
      window.location.href = '/loginDemo';
    }

    return Promise.reject(error);
  }
);

export default api;
