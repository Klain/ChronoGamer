import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autorización
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (username: string, password: string) =>
  api.post('/api/auth/register', { username, password });

export const loginUser = (username: string, password: string) =>
  api.post('/api/auth/login', { username, password });

export const fetchGamesByDate = (date?: string) =>
  api.get('/api/games', { params: { date } });

export const fetchGameDetails = (id: number) =>
  api.get(`/api/games/${id}`);

export default api;
