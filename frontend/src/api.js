import axios from 'axios';

// Automatically uses your live Render backend in production and localhost during development
const API_URL = import.meta.env.VITE_API_URL || "https://palan-mp3q.onrender.com";

const API = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Automatically attach authorization token to requests if available
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;