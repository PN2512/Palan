import axios from 'axios';

// Automatically uses your live Render backend in production and localhost during development
const API_URL = import.meta.env.VITE_API_URL || "https://palan-mp3q.onrender.com";

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default API;