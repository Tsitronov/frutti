
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

let accessToken = null;
let isRefreshing = false;
let refreshPromise = null;

export const setTokens = (token) => {
  accessToken = token;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = axios
          .post(`${baseURL}/api/refresh`, {}, { withCredentials: true })
          .then((res) => {
            const newAccess = res.data?.accessToken;

            if (newAccess) {
              setTokens(newAccess);
              return newAccess;
            } else {
              throw new Error('No accessToken from refresh');
            }
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      try {
        const newAccess = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch {
        setTokens(null);
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      setTokens(null);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
