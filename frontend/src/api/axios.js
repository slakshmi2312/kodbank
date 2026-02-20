/**
 * Axios instance with credentials for httpOnly cookie (JWT)
 * Use direct backend URL so registration works even if Vite proxy is not used
 */
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true, // Required for httpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
