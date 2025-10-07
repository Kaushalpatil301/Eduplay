import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Parent APIs
export const parentAPI = {
  getDashboard: async () => {
    const response = await api.get('/parent/dashboard');
    return response.data;
  },
  getKids: async () => {
    const response = await api.get('/parent/kids');
    return response.data;
  },
  setDailyLimit: async (limit) => {
    const response = await api.post('/parent/limit', { limit });
    return response.data;
  },
  getKidActivity: async () => {
    const response = await api.get('/parent/activity');
    return response.data;
  },
};

// Kid APIs
export const kidAPI = {
  getActivities: async () => {
    const response = await api.get('/kid/activities');
    return response.data;
  },
  completeActivity: async (activityId) => {
    const response = await api.post(`/kid/activity/complete/${activityId}`);
    return response.data;
  },
  getProgress: async () => {
    const response = await api.get('/kid/progress');
    return response.data;
  },
  getRewards: async () => {
    const response = await api.get('/kid/rewards');
    return response.data;
  },
};

export default api;
