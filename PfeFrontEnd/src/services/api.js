import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

// Create axios instance with base URL
const instance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased timeout for blockchain operations
  withCredentials: true
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const { status } = error.response;
      
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // For your app, implement a proper token refresh if needed
          // For now, just redirect to login
          console.log('Authentication expired. Redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        } catch (refreshError) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      // Add specific error handling for different status codes
      switch (status) {
        case 403:
          console.error('Access denied. You do not have permission to access this resource.');
          error.friendlyMessage = "Accès refusé. Vous n'avez pas les permissions nécessaires pour cette action.";
          break;
        case 404:
          error.friendlyMessage = "La ressource demandée n'existe pas.";
          break;
        case 500:
          error.friendlyMessage = "Une erreur serveur s'est produite. Veuillez réessayer plus tard.";
          break;
        default:
          error.friendlyMessage = "Une erreur s'est produite. Veuillez réessayer.";
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
      error.friendlyMessage = "Pas de réponse du serveur. Veuillez vérifier votre connexion internet.";
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request', error.message);
      error.friendlyMessage = "Erreur lors de la préparation de la requête.";
    }
    
    return Promise.reject(error);
  }
);

export const api = {
  get: (url, config) => instance.get(url, config),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config)
};