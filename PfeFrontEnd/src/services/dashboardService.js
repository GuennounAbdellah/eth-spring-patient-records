import { api } from './api';

export const dashboardService = {
  // Patient dashboard methods
  getPatientDashboard() {
    return api.get('/api/dashboard/patient');
  },
  
  // Doctor dashboard methods
  getDoctorDashboard() {
    return api.get('/api/dashboard/doctor');
  },
  
  // Get patients that granted access to the doctor
  getDoctorPatients() {
    return api.get('/api/dashboard/doctor/patients');
  },
  
  // Get consultations for a specific patient (doctor's view)
  getPatientConsultationsForDoctor(patientId) {
    return api.get(`/api/dashboard/doctor/patient/${patientId}/consultations`);
  },

  // Get doctor dashboard data including stats
  getDoctorDashboardData() {
    return Promise.all([
      this.getDoctorPatients(),
      this.getRecentConsultations(),
      this.getUpcomingConsultations()
    ]).then(([patients, recentConsultations, upcomingConsultations]) => {
      return {
        totalPatients: patients.length,
        recentConsultations: recentConsultations.length,
        upcomingConsultations: upcomingConsultations.length,
        patients,
        recentConsultations,
        upcomingConsultations
      };
    });
  },

  // Get recent consultations for the doctor
  getRecentConsultations() {
    return api.get('/api/consultations/doctor/recent')
      .catch(error => {
        console.error('Error fetching recent consultations:', error);
        return [];
      });
  },

  // Get upcoming consultations for the doctor
  getUpcomingConsultations() {
    return api.get('/api/appointments/doctor')
      .catch(error => {
        console.error('Error fetching upcoming consultations:', error);
        return [];
      });
  },

  // Get patient details for a specific patient
  getPatientDetails(patientId) {
    return api.get(`/api/patients/${patientId}`);
  },

  // Get consultations for a specific patient
  getPatientConsultations(patientId) {
    return api.get(`/api/consultations?patientId=${patientId}`);
  }
};