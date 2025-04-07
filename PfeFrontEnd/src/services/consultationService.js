import { api } from './api';

export const consultationService = {
  // Doctor functions
  getPatients() {
    return api.get('/api/dashboard/doctor/patients');
  },
  
  getConsultations(patientId) {
    return api.get(`/api/dashboard/doctor/patient/${patientId}/consultations`);
  },
  
  addConsultation(consultationData) {
    // Make sure the request matches the backend DTO format
    return api.post('/api/consultations', {
      patientId: consultationData.patientId,
      details: consultationData.details,
      metadata: consultationData.metadata
    });
  },
  
  deleteConsultation(patientId, timestamp) {
    return api.delete('/api/consultations', {
      data: {
        patientId: patientId,
        timestamp: timestamp
      }
    });
  },
  
  // Patient functions
  getPatientConsultations() {
    return api.get('/api/consultations/patient');
  }
};