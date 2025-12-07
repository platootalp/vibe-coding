import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

// Workout API
export const workoutAPI = {
  getWorkouts: () => api.get('/workouts'),
  getWorkout: (id: string) => api.get(`/workouts/${id}`),
  createWorkout: (workoutData: any) => api.post('/workouts', workoutData),
  updateWorkout: (id: string, workoutData: any) => api.put(`/workouts/${id}`, workoutData),
  deleteWorkout: (id: string) => api.delete(`/workouts/${id}`),
};

// Health Profile API
export const healthAPI = {
  getHealthProfile: () => api.get('/health/profile'),
  updateHealthProfile: (profileData: any) => api.put('/health/profile', profileData),
  getMetricsHistory: (params?: any) => api.get('/health/metrics-history', { params }),
  addMetricsRecord: (metricsData: any) => api.post('/health/metrics', metricsData),
  updateMetricsRecord: (id: string, metricsData: any) => api.put(`/health/metrics/${id}`, metricsData),
  deleteMetricsRecord: (id: string) => api.delete(`/health/metrics/${id}`),
};

// Workout Plan API
export const workoutPlanAPI = {
  getWorkoutPlans: (params?: any) => api.get('/workout-plans', { params }),
  getWorkoutPlan: (id: string) => api.get(`/workout-plans/${id}`),
  createWorkoutPlan: (planData: any) => api.post('/workout-plans', planData),
  updateWorkoutPlan: (id: string, planData: any) => api.put(`/workout-plans/${id}`, planData),
  deleteWorkoutPlan: (id: string) => api.delete(`/workout-plans/${id}`),
  getWorkoutTypes: () => api.get('/workout-plans/types'),
};

export default api;