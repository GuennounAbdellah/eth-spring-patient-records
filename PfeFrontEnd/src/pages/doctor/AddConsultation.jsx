import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConsultationForm from '../../components/common/ConsultationForm';
import { api } from '../../services/api';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import './AddConsultation.css';

const AddConsultation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [permissionError, setPermissionError] = useState(false);

  // Fetch patient details and check permissions
  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      
      try {
        // First check if doctor has permission to access this patient
        const permissionResponse = await api.get(`/api/permissions/check?patientId=${patientId}`);
        
        if (!permissionResponse.hasPermission) {
          setPermissionError(true);
          setError("Vous n'avez pas l'autorisation d'accéder à ce patient. Demandez une permission d'accès.");
          setLoading(false);
          return;
        }
      } catch (permErr) {
        console.error("Permission check error:", permErr);
        setPermissionError(true);
        setError("Erreur lors de la vérification des permissions. Le patient doit vous accorder l'accès.");
        setLoading(false);
        return;
      }
      
      // If permission exists, fetch patient details
      try {
        const patientResponse = await api.get(`/api/patients/${patientId}`);
        setPatient(patientResponse);
        setError(null);
      } catch (patientErr) {
        console.error("Error fetching patient details:", patientErr);
        setError(`Patient non trouvé ou accès refusé: ${patientErr.message || 'Erreur inconnue'}`);
      }
    } catch (err) {
      console.error("Error in fetchPatientDetails:", err);
      setError("Une erreur s'est produite lors de la récupération des données patient.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConsultation = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Prepare consultation data
      const consultationData = {
        patientId: patientId,
        details: formData.diagnosis,
        metadata: JSON.stringify({
          symptoms: formData.symptoms || '',
          treatment: formData.treatment || '',
          notes: formData.notes || ''
        })
      };

      // Submit consultation to API
      await api.post('/api/consultations', consultationData);
      
      setSuccess("Consultation enregistrée avec succès");
      
      // Navigate back to patient details after a short delay
      setTimeout(() => {
        navigate(`/doctor/patient/${patientId}`);
      }, 1500);
      
    } catch (err) {
      console.error("Error submitting consultation:", err);
      setError(`Erreur lors de l'enregistrement de la consultation: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestAccess = async () => {
    try {
      setError(null);
      const response = await api.post('/api/permissions/request-access', {
        patientId: patientId
      });
      
      setSuccess("Demande d'accès envoyée avec succès. Le patient sera notifié.");
      
      // Navigate back to patients list after 2 seconds
      setTimeout(() => {
        navigate('/doctor/patients');
      }, 2000);
    } catch (err) {
      console.error("Error requesting access:", err);
      setError(`Erreur lors de la demande d'accès: ${err.message || 'Erreur inconnue'}`);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Chargement des informations du patient..." />;
  }

  if (permissionError) {
    return (
      <div className="permission-error-container">
        <div className="permission-error">
          <h2>Accès refusé</h2>
          <p>{error || "Vous n'avez pas l'autorisation d'accéder à ce patient"}</p>
          <p>Demandez au patient de vous autoriser l'accès à son dossier médical.</p>
          <div className="error-actions">
            <button 
              className="request-button"
              onClick={handleRequestAccess}
            >
              Demander l'accès
            </button>
            <button 
              className="return-button"
              onClick={() => navigate('/doctor/patients')}
            >
              Retour à la liste des patients
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-consultation-container">
      <div className="consultation-header">
        <h2>Nouvelle consultation</h2>
        {patient && (
          <div className="patient-info">
            <h3>Patient: {patient.fullName || patient.username}</h3>
            {patient.medicalRecordNumber && (
              <p>Numéro de dossier: {patient.medicalRecordNumber}</p>
            )}
          </div>
        )}
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onClose={() => setError(null)} 
          className="consultation-error"
        />
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <ConsultationForm 
        onSubmit={handleSubmitConsultation} 
        loading={submitting}
      />
      
      <div className="form-actions">
        <button 
          type="button"
          className="cancel-button"
          onClick={() => navigate(`/doctor/patient/${patientId}`)}
          disabled={submitting}
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default AddConsultation;