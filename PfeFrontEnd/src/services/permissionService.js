import { api } from './api';

export const permissionService = {
  // Get doctors that have access to the patient's medical records
  getAuthorizedDoctors() {
    return api.get('/api/dashboard/patient/doctors');
  },
  
  // Get all available doctors for granting access
  getAllDoctors() {
    // This endpoint may need to be created on the backend
    return api.get('/api/users/doctors');
  },
  
  // Grant access to a doctor
  grantAccess(doctorUsername, durationDays) {
    // Convert days to timestamp if needed
    const expiresAt = durationDays ? Math.floor(Date.now()/1000) + (durationDays * 24 * 60 * 60) : 0;
    
    return api.post('/api/permissions/grant-access', {
      doctorUsername: doctorUsername,
      expiresAt: expiresAt
    });
  },
  
  // Remove a doctor's access
  removeAccess(doctorUsername) {
    return api.post('/api/permissions/remove-access', {
      doctorUsername: doctorUsername
    });
  },
  
  // Revoke access
  revokeAccess(permissionId) {
    return api.delete(`/api/permissions/${permissionId}`);
  },
  
  // Get permissions granted by patient
  getPatientPermissions() {
    return api.get('/api/permissions/patient');
  },
  
  // Get permissions granted to doctor
  getDoctorPermissions() {
    return api.get('/api/permissions/doctor');
  }
};