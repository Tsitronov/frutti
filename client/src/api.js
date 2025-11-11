import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken = null;

export const setTokens = (newAccess) => {
  accessToken = newAccess;
  console.log('Token set:', accessToken ? 'Yes' : 'No');  // Добавил лог для проверки setTokens после login
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    console.log('Token added to request:', config.url);  // Лог: добавлен ли token и к какому URL
  } else {
    console.warn('No token for request:', config.url);  // Лог: если token null — проблема здесь
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${baseURL}/api/refresh`, {}, { withCredentials: true });
        const newAccess = res.data?.accessToken;

        if (newAccess) {
          setTokens(newAccess);
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('❌ Ошибка обновления токена:', err);
        setTokens(null);
        window.location.href = '/login';
      }
    }

    if (error.response && error.response.status === 403) {
      setTokens(null);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;