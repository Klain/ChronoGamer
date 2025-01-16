//src\services\api.ts
import axios from 'axios';
import { ApiGame } from '../models/ApiGame';


const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token){
  //if (token && !config.url?.includes('/gotd')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const registerUser = (username: string, password: string) =>
  api.post('/api/auth/register', { username, password });

export const loginUser = (username: string, password: string) =>
  api.post('/api/auth/login', { username, password });

export const fetchGamesByDate = async (date: string): Promise<ApiGame[]> => {
  const response = await api.get(`/api/games?date=${date}`);
  return response.data;
};

export const fetchGameDetails = (id: number) =>
  api.get(`/api/games/${id}`);

export const fetchGameOfTheDay = async (): Promise<ApiGame> => {
  const response = await api.get('/api/games/gotd');
  return response.data;
};

export const voteForGame = async (id: number): Promise<void> => {
  await api.post(`/api/games/${id}/vote`);
};

export default api;
