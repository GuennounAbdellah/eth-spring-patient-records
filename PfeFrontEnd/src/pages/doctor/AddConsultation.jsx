import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import { consultationService } from "../../services/consultationService";
import ConsultationForm from "../../components/common/ConsultationForm";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./AddConsultation.css";

const AddConsultation = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      setLoading(true);
      try {
        const patients = await dashboardService.getDoctorPatients();
        const foundPatient = patients.find(p => p.id === patientId);
        
        if (!foundPatient) {
          throw new Error("Patient non trouvé ou accès refusé");
        }
        
        // Ensure patient always has a fullName
        if (!foundPatient.fullName) {
          foundPatient.fullName = `${foundPatient.firstName || ''} ${foundPatient.lastName || ''}`.trim() || foundPatient.username;
        }
        
        setPatient(foundPatient);
        setError(null);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des données du patient");
        console.error("Error fetching patient details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const handleConsultationSubmit = async (consultationData) => {
    try {
      setLoading(true);
      await consultationService.addConsultation({
        patientId,
        ...consultationData
      });
      
      // Navigate to patient record after successful submission
      navigate(`/doctor/patient/${patientId}`, { 
        state: { message: "Consultation ajoutée avec succès!" } 
      });
    } catch (err) {
      setError("Erreur lors de l'ajout de la consultation");
      console.error("Error adding consultation:", err);
      setLoading(false);
    }
  };

  if (loading && !patient) {
    return <LoadingIndicator message="Chargement..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="add-consultation-container">
      <div className="page-header">
        <h2>Nouvelle consultation</h2>
        <Link to={`/doctor/patient/${patientId}`} className="back-link">
          &larr; Retour au dossier patient
        </Link>
      </div>
      
      {patient && (
        <div className="patient-summary">
          <h3>Patient: {patient.fullName}</h3>
          {patient.medicalRecordNumber && (
            <p>Dossier médical n° {patient.medicalRecordNumber}</p>
          )}
        </div>
      )}
      
      <ConsultationForm 
        onSubmit={handleConsultationSubmit} 
        loading={loading}
      />
    </div>
  );
};

export default AddConsultation;