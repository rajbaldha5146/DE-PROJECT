import axios from 'axios';

const API_URL = 'http://localhost:3500/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to attach authorization token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication API
export const authAPI = {
  // Send OTP for signup
  sendOTP: async (email) => {
    try {
      const response = await api.post('/auth/send-otp', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to send OTP' };
    }
  },

  // Register new user
  signup: async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to register user' };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to login' };
    }
  },

  // Get authenticated user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // You might want to call a logout endpoint here if your backend requires it
  },
};

export default api; 