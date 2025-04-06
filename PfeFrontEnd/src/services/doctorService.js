import { api } from './api';

export const doctorService = {
  // Profile management
  getProfile() {
    return api.get('/api/profile');
  },
  
  updateProfile(profileData) {
    return api.put('/api/profile', profileData);
  },
  
  // Patient access
  getPatients() {
    return api.get('/api/dashboard/doctor/patients');
  },
  
  getPatientRecord(patientId) {
    return api.get(`/api/dashboard/doctor/patients/${patientId}`);
  },
  
  // Dashboard data
  getDashboardSummary() {
    return api.get('/api/dashboard/doctor/summary');
  },
  
  // Consultations
  getConsultations(patientId) {
    return api.get(`/api/consultations/patient/${patientId}`);
  },
  
  addConsultation(consultationData) {
    return api.post('/api/consultations', consultationData);
  },
  
  updateConsultation(consultationId, consultationData) {
    return api.put(`/api/consultations/${consultationId}`, consultationData);
  },
  
  deleteConsultation(consultationId) {
    return api.delete(`/api/consultations/${consultationId}`);
  },
  
  // Appointments
  getAppointments() {
    return api.get('/api/dashboard/doctor/appointments');
  },
  
  updateAppointmentStatus(appointmentId, status) {
    return api.patch(`/api/dashboard/doctor/appointments/${appointmentId}`, { status });
  }
};