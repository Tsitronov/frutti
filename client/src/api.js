import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true // 🔥 обязательно для передачи cookie
});

let accessToken = null;

export const setTokens = (newAccess) => {
  accessToken = newAccess;
  if (newAccess) {
    localStorage.setItem('token', newAccess);
  } else {
    localStorage.removeItem('token');
  }
};

// 🔹 Перехватчик запросов — добавляем accessToken
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// 🔁 Перехватчик ответов — если 401, пробуем обновить через cookie
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // ⚡ refresh без передачи токена вручную — он в cookie
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        if (!newAccessToken) throw new Error('Нет accessToken');

        setTokens(newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // повторяем запрос
      } catch (refreshErr) {
        console.error('❌ Ошибка refresh:', refreshErr);
        setTokens(null);
        window.location.href = '/loginDemo';
      }
    }

    if (error.response?.status === 403) {
      setTokens(null);
      window.location.href = '/loginDemo';
    }

    return Promise.reject(error);
  }
);

export default api;

