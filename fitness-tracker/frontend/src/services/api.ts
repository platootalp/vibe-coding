import axios from 'axios';
// Import mock APIs
import * as mockAPIs from '../mock/mockApi';

// Determine if we should use mock APIs (in development)
// Fix for browser environment - check if process exists
const IS_BROWSER = typeof process === 'undefined' || !process.env;
const USE_MOCK_APIS = !IS_BROWSER && process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_MOCK_APIS === 'true';

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
export const authAPI = USE_MOCK_APIS ? mockAPIs.mockAuthAPI : {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  // OAuth APIs
  googleLogin: (data: any) => api.post('/auth/oauth/google', data),
  appleLogin: (data: any) => api.post('/auth/oauth/apple', data),
  wechatLogin: (data: any) => api.post('/auth/oauth/wechat', data),
};

// User API
export const userAPI = USE_MOCK_APIS ? mockAPIs.mockUserAPI : {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

// Workout API
export const workoutAPI = USE_MOCK_APIS ? mockAPIs.mockWorkoutAPI : {
  getAll: () => api.get('/workouts'),
  getById: (id: string) => api.get(`/workouts/${id}`),
  create: (data: any) => api.post('/workouts', data),
  update: (id: string, data: any) => api.put(`/workouts/${id}`, data),
  delete: (id: string) => api.delete(`/workouts/${id}`),
  import: (data: any) => api.post('/workouts/import', data), // Add import function
  // Add missing methods
  getTypes: () => api.get('/workouts/types'),
  getPlans: () => api.get('/workouts/plans'),
  createPlan: (planData: any) => api.post('/workouts/plans', planData),
  updatePlan: (id: string, planData: any) => api.put(`/workouts/plans/${id}`, planData),
  deletePlan: (id: string) => api.delete(`/workouts/plans/${id}`),
};

// Stats API
export const statsAPI = {
  getWorkoutStats: () => api.get('/stats/workouts'),
  getWeeklyStats: () => api.get('/stats/weekly'),
};

// Health Profile API
export const healthAPI = USE_MOCK_APIS ? mockAPIs.mockHealthAPI : {
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

// Nutrition API
export const nutritionAPI = USE_MOCK_APIS ? mockAPIs.mockNutritionAPI : {
  getNutritionLogs: (params?: any) => api.get('/nutrition/logs', { params }),
  getNutritionLog: (id: string) => api.get(`/nutrition/logs/${id}`),
  createNutritionLog: (logData: any) => api.post('/nutrition/logs', logData),
  updateNutritionLog: (id: string, logData: any) => api.put(`/nutrition/logs/${id}`, logData),
  deleteNutritionLog: (id: string) => api.delete(`/nutrition/logs/${id}`),
  getFoods: (params?: any) => api.get('/nutrition/foods', { params }),
  getMeals: () => api.get('/nutrition/meals'),
  getNutritionSummary: (params?: any) => api.get('/nutrition/summary', { params }),
};

// Social API
export const socialAPI = {
  getFeedPosts: (params?: any) => api.get('/social/feed', { params }),
  getUserPosts: () => api.get('/social/posts'),
  createPost: (postData: any) => api.post('/social/posts', postData),
  updatePost: (id: string, postData: any) => api.put(`/social/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/social/posts/${id}`),
  getPostComments: (id: string) => api.get(`/social/posts/${id}/comments`),
  addComment: (id: string, commentData: any) => api.post(`/social/posts/${id}/comments`, commentData),
  getUserAchievements: () => api.get('/social/achievements'),
  getLeaderboard: () => api.get('/social/leaderboard'),
};

// Notification API
export const notificationAPI = {
  getNotifications: (params?: any) => api.get('/notifications', { params }),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Device API
export const deviceAPI = {
  syncDeviceData: (data: any) => api.post('/devices/sync', data),
  getDeviceSyncHistory: () => api.get('/devices/sync'),
  getDeviceSyncData: (deviceId: string) => api.get(`/devices/sync/${deviceId}`),
};

// Admin API
export const adminAPI = {
  getSystemStats: () => api.get('/admin/stats'),
  getAllUsers: (params?: any) => api.get('/admin/users', { params }),
};

export default api;