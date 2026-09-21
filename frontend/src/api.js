import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This pulls the URL from Vercel
});

export default API;