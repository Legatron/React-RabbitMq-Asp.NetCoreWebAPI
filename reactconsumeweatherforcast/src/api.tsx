import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7165'
});

const tokenStorageKey = 'token';

// Check if token is already stored in localStorage
const storedToken = localStorage.getItem(tokenStorageKey);

if (storedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(tokenStorageKey);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle token refresh
api.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error.response.status === 401) {
    // Token is invalid or expired, get a new token
    try {
      const response = await api.post('/gettoken', {
        username: 'your_username',
        password: 'your_password'
      });
      const newToken = response.data;
      localStorage.setItem('token', newToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      // Retry the original request with the new token
      return await api.request(error.config);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});

export default api;