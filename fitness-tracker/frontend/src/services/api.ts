import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: Partial<{
    name: string;
    email: string;
    age: number;
    height: number;
    weight: number;
    gender: string;
  }>) => api.put('/users/profile', data),
};

// Workout API
export const workoutAPI = {
  getAll: () => api.get('/workouts'),
  getById: (id: string) => api.get(`/workouts/${id}`),
  create: (data: any) => api.post('/workouts', data),
  update: (id: string, data: any) => api.put(`/workouts/${id}`, data),
  delete: (id: string) => api.delete(`/workouts/${id}`),
};

// Stats API
export const statsAPI = {
  getWorkoutStats: () => api.get('/stats/workouts'),
  getWeeklyStats: () => api.get('/stats/weekly'),
};

export default api;