import { api } from './api';

export const userService = {
  // Get all users (admin only)
  getAllUsers() {
    return api.get('/api/admin/users');
  },
  
  // Get users by role (admin only)
  getUsersByRole(role) {
    // If role is "all", use the getAllUsers endpoint instead
    if (role.toLowerCase() === 'all') {
      return this.getAllUsers();
    }
    return api.get(`/api/admin/users/by-role?role=${role}`);
  },
  
  // Get user profile - generic function for any user type
  getProfile() {
    return api.get('/api/profile');
  },
  
  // Update user profile
  updateProfile(profileData) {
    return api.put('/api/profile', profileData);
  },
  
  // Get all doctors
  getDoctors() {
    return api.get('/api/users/doctors');
  },
  
  // Update user status (active/inactive)
  updateUserStatus(userId, isActive) {
    return api.put(`/api/admin/users/${userId}/status`, { isActive });
  }
};