import { api } from './api';

export const adminService = {
  // Get all users
  getAllUsers() {
    return api.get('/api/admin/users');
  },
  
  // Get users by role
  getUsersByRole(role) {
    return api.get(`/api/admin/users/by-role?role=${role}`);
  },
  
  // Register a new doctor
  registerDoctor(doctorData) {
    return api.post('/api/auth/register/doctor', doctorData);
  },
  
  // Register a new patient
  registerPatient(patientData) {
    return api.post('/api/auth/register/patient', patientData);
  },
  
  // Register a new admin
  registerAdmin(adminData) {
    return api.post('/api/auth/register', {
      ...adminData,
      role: 'ADMIN'
    });
  },
  
  // Update user status (active/inactive)
  updateUserStatus(userId, isActive) {
    return api.put(`/api/admin/users/${userId}/status`, { isActive });
  },
  
  // Get user details
  getUserDetails(userId) {
    return api.get(`/api/admin/users/${userId}`);
  }
};