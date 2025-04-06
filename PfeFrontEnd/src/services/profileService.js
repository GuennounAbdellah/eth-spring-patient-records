import { api } from './api';

export const profileService = {
  // Get current user's profile
  getProfile() {
    return api.get('/api/profile');
  },
  
  // Update basic user profile info
  updateProfile(profileData) {
    return api.put('/api/profile', profileData);
  },
  
  // Update patient-specific medical information
  updateMedicalInfo(medicalData) {
    return api.put('/api/profile/medical-info', medicalData);
  },
  
  // Update user password
  changePassword(passwordData) {
    return api.post('/api/profile/password', passwordData);
  },
  
  // Upload profile image
  uploadProfilePicture(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    return api.post('/api/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};