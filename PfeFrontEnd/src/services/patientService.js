import { api } from './api';

export const patientService = {
  // Get doctors that have access to the patient's medical records
  getAuthorizedDoctors() {
    return api.get('/api/dashboard/patient/doctors');
  },
  
  // Get patient consultations history
  getConsultations() {
    return api.get('/api/consultations/patient');
  },
  
  // Grant access to a doctor
  grantAccess(doctorUsername, durationDays) {
    return api.post('/api/permissions/grant-access', {
      doctorUsername: doctorUsername,
      durationInDays: durationDays
    });
  },
  
  // Remove a doctor's access
  removeAccess(doctorUsername) {
    return api.post('/api/permissions/remove-access', {
      doctorUsername: doctorUsername
    });
  },
  
  // Get profile information
  getProfile() {
    return api.get('/api/profile');
  },
  
  // Update profile information
  updateProfile(profileData) {
    return api.put('/api/profile', profileData);
  }
};