/**
 * Axios instance with credentials for httpOnly cookie (JWT)
 * Use direct backend URL so registration works even if Vite proxy is not used
 */
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
