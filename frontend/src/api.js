import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://palan-mp3q.onrender.com',
  withCredentials: true,
});

export default API;