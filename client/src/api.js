// api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// 🔄 Перехватчик для автоматического обновления токена
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⚠️ Если токен истёк, пробуем обновить
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/refresh`, { refreshToken });

        const newAccessToken = res.data.accessToken;

        // 💾 Сохраняем новый токен
        localStorage.setItem("token", newAccessToken);

        // 🌀 Повторяем исходный запрос с новым токеном
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Не удалось обновить токен:", refreshError);
        // Если refresh тоже не удался — удаляем токены и выходим из аккаунта
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // или другой маршрут
      }
    }

    return Promise.reject(error);
  }
);

export default api;
