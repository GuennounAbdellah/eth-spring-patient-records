// src/components/doctor/PatientInfo.jsx
import PropTypes from "prop-types";
import "./PatientInfo.css";

const PatientInfo = ({ patient }) => {
  if (!patient) {
    return <div className="no-patient-data">Données du patient non disponibles</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Non renseigné";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    } catch (e) {
      return "Format de date invalide";
    }
  };

  return (
    <div className="patient-info">
      <div className="info-section basic-info">
        <div className="info-item">
          <span className="info-label">Nom:</span>
          <span className="info-value">{patient.fullName}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Numéro de dossier:</span>
          <span className="info-value">{patient.medicalRecordNumber || "Non renseigné"}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Date de naissance:</span>
          <span className="info-value">{formatDate(patient.dateOfBirth)}</span>
        </div>
      </div>
      
      <div className="info-section medical-info">
        <div className="info-item">
          <span className="info-label">Groupe sanguin:</span>
          <span className="info-value">{patient.bloodGroup || "Non renseigné"}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Allergies:</span>
          <span className="info-value allergies">{patient.allergies || "Aucune allergie connue"}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Maladies chroniques:</span>
          <span className="info-value conditions">{patient.chronicConditions || "Aucune maladie chronique connue"}</span>
        </div>
      </div>
      
      <div className="info-section contact-info">
        <div className="info-item">
          <span className="info-label">Contact d'urgence:</span>
          <span className="info-value">{patient.emergencyContact || "Non renseigné"}</span>
        </div>
      </div>
    </div>
  );
};

PatientInfo.propTypes = {
  patient: PropTypes.shape({
    fullName: PropTypes.string,
    medicalRecordNumber: PropTypes.string,
    dateOfBirth: PropTypes.string,
    bloodGroup: PropTypes.string,
    allergies: PropTypes.string,
    chronicConditions: PropTypes.string,
    emergencyContact: PropTypes.string
  })
};

export default PatientInfo;