import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Get user's role type for navigation
  const getUserRoleType = () => {
    if (!user || !user.role) return null;
    
    // Converting ROLE_PATIENT to patient
    return user.role.replace('ROLE_', '').toLowerCase();
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!token;

  // Login function
  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', { username, password });
      
      const { token: newToken, profile } = response;
      
      // Save token and user data
      setToken(newToken);
      setUser(profile);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(profile));
      
      return { 
        success: true,
        userType: getUserRoleTypeFromRole(profile.role)
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        error: error.friendlyMessage || "Nom d'utilisateur ou mot de passe incorrect" 
      };
    }
  };

  // Get role type from role string
  const getUserRoleTypeFromRole = (role) => {
    if (!role) return null;
    return role.replace('ROLE_', '').toLowerCase();
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      const response = await api.put('/api/profile', userData);
      
      setUser({...user, ...response});
      localStorage.setItem('user', JSON.stringify({...user, ...response}));
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { error: error.friendlyMessage || "Échec de la mise à jour du profil" };
    }
  };

  // Load user from storage or fetch from API if needed
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (token) {
          const storedUser = localStorage.getItem('user');
          
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            try {
              // If token exists but no user data, fetch profile from API
              const profileResponse = await api.get('/api/profile');
              setUser(profileResponse);
              localStorage.setItem('user', JSON.stringify(profileResponse));
            } catch (error) {
              console.error('Error fetching user profile:', error);
              logout(); // Clear authentication on error
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [token]);

  // Create the context value object
  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: isAuthenticated(),
    userRoleType: getUserRoleType(),
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};