import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
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


api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        if (!newAccessToken) throw new Error('Non ce accessToken');

        setTokens(newAccessToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        console.error('❌ Error refresh:', refreshErr);
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

