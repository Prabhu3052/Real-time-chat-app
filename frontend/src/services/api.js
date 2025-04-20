import axios from 'axios';

const API_URL = 'https://real-time-chat-app-mxah.onrender.com/api'; // Update with your backend URL

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
};

export const messageService = {
    getMessages: () => api.get('/messages'),
    sendMessage: (message) => api.post('/messages', message),
};

export default api;
