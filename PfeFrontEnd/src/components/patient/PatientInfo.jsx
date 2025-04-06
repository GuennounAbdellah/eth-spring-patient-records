// src/components/patient/PatientInfo.jsx
import PropTypes from 'prop-types';
import './PatientInfo.css';

const PatientInfo = ({ patient }) => {
  if (!patient) {
    return <div className="patient-info placeholder">Informations patient non disponibles</div>;
  }

  return (
    <div className="patient-info">
      <h3>Informations du patient</h3>
      <div className="info-grid">
        <div className="info-item">
          <span className="label">Nom complet:</span>
          <span className="value">{patient.fullName || 'Non renseigné'}</span>
        </div>
        <div className="info-item">
          <span className="label">Date de naissance:</span>
          <span className="value">{patient.dateOfBirth || 'Non renseignée'}</span>
        </div>
        <div className="info-item">
          <span className="label">Groupe sanguin:</span>
          <span className="value">{patient.bloodGroup || 'Non renseigné'}</span>
        </div>
        <div className="info-item">
          <span className="label">Genre:</span>
          <span className="value">{patient.gender || 'Non renseigné'}</span>
        </div>
        <div className="info-item">
          <span className="label">Allergies:</span>
          <span className="value">
            {patient.allergies && patient.allergies.length > 0 
              ? patient.allergies.join(', ') 
              : 'Aucune allergie connue'}
          </span>
        </div>
        <div className="info-item">
          <span className="label">Numéro de dossier:</span>
          <span className="value">{patient.medicalRecordNumber || 'Non renseigné'}</span>
        </div>
      </div>
    </div>
  );
};

PatientInfo.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    fullName: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    bloodGroup: PropTypes.string,
    allergies: PropTypes.arrayOf(PropTypes.string),
    medicalRecordNumber: PropTypes.string
  })
};

export default PatientInfo;