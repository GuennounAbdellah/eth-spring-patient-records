import React from "react";
import PropTypes from "prop-types";
import "./ConsultationHistory.css";

const ConsultationHistory = ({ consultations = [], onDelete, role = "patient" }) => {
  if (!consultations || consultations.length === 0) {
    return (
      <div className="no-consultations">
        <p>Aucune consultation trouvée.</p>
      </div>
    );
  }

  // Helper function to format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return "Date non disponible";
    
    // If timestamp is a number (unix timestamp), convert it
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp);
    
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Generate a unique key for each consultation
  const getConsultationKey = (consultation, index) => {
    // Try to use id, timestamp, or fallback to index
    return consultation.id || 
           consultation.timestamp || 
           `consultation-${index}`;
  };

  return (
    <div className="consultation-history">
      {consultations.map((consultation, index) => (
        <div className="consultation-card" key={getConsultationKey(consultation, index)}>
          <div className="consultation-header">
            <div className="consultation-date">
              {formatDate(consultation.timestamp || consultation.date)}
            </div>
            {role === "doctor" && onDelete && (
              <button
                className="delete-button"
                onClick={() => onDelete(consultation.id, consultation.timestamp)}
              >
                Supprimer
              </button>
            )}
          </div>
          <div className="consultation-body">
            {role === "patient" && consultation.doctorName && (
              <div className="consultation-doctor">
                <span className="label">Médecin:</span> Dr. {consultation.doctorName}
              </div>
            )}
            {role === "doctor" && consultation.patientName && (
              <div className="consultation-patient">
                <span className="label">Patient:</span> {consultation.patientName}
              </div>
            )}
            <div className="consultation-details">
              <div className="consultation-diagnosis">
                <span className="label">Diagnostic:</span> {consultation.details || consultation.diagnosis || "Pas de diagnostic"}
              </div>
              {consultation.symptoms && (
                <div className="consultation-symptoms">
                  <span className="label">Symptômes:</span> {consultation.symptoms}
                </div>
              )}
              {consultation.treatment && (
                <div className="consultation-treatment">
                  <span className="label">Traitement:</span> {consultation.treatment}
                </div>
              )}
              {consultation.notes && (
                <div className="consultation-notes">
                  <span className="label">Notes:</span> {consultation.notes}
                </div>
              )}
              {consultation.metadata && (
                <div className="consultation-metadata">
                  <span className="label">Données additionnelles:</span>
                  <pre>{typeof consultation.metadata === 'string' ? consultation.metadata : JSON.stringify(consultation.metadata, null, 2)}</pre>
                </div>
              )}
            </div>
            {consultation.blockchainHash && (
              <div className="blockchain-reference">
                <span className="label">Transaction blockchain:</span>
                <span className="hash">{consultation.blockchainHash}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

ConsultationHistory.propTypes = {
  consultations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string, // Make id optional (removed isRequired)
      timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      date: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      doctorName: PropTypes.string,
      patientName: PropTypes.string,
      details: PropTypes.string,
      diagnosis: PropTypes.string,
      symptoms: PropTypes.string,
      treatment: PropTypes.string,
      notes: PropTypes.string,
      metadata: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      blockchainHash: PropTypes.string,
    })
  ).isRequired,
  onDelete: PropTypes.func,
  role: PropTypes.oneOf(["patient", "doctor"]),
};

export default ConsultationHistory;