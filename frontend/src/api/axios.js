/**
 * Axios instance with credentials for httpOnly cookie (JWT)
 * 
 * PRODUCTION SETUP:
 * - Set VITE_API_URL environment variable in Vercel:
 *   - Vercel Dashboard → Settings → Environment Variables
 *   - Name: VITE_API_URL
 *   - Value: https://kodbank-pzd4.onrender.com/api (or your backend URL)
 *   - Environments: Production, Preview, Development
 * 
 * LOCAL DEVELOPMENT:
 * - If VITE_API_URL is not set, defaults to http://localhost:5001/api
 * - Backend should be running on port 5001 locally
 * - Vite proxy (vite.config.js) handles /api requests in dev mode
 */
import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const baseURL = import.meta.env.VITE_API_URL || 'https://kodbank-pzd4.onrender.com/api';

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
