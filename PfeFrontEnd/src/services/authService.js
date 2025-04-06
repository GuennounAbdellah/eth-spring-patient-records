import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Create a dedicated instance for auth to avoid circular dependencies
const authInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const authService = {
  // Login user
  async login(username, password) {
    try {
      const response = await authInstance.post('/api/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await authInstance.post('/api/auth/register/patient', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await authInstance.post('/api/auth/refresh-token', {
        refreshToken: localStorage.getItem('refreshToken')
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
};

// Export refreshToken function directly for api.js to import
export const refreshToken = authService.refreshToken;