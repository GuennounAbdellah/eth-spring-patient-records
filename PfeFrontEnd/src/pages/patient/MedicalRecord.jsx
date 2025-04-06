import React, { useState, useEffect } from "react";
import { patientService } from "../../services/patientService";
import ConsultationHistory from "../../components/common/ConsultationHistory";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./MedicalRecord.css";

const MedicalRecord = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchMedicalData = async () => {
      try {
        setLoading(true);
        
        // Fetch patient consultations and profile in parallel
        const [consultationsData, profileData] = await Promise.all([
          patientService.getConsultations(),
          patientService.getProfile()
        ]);
        
        setConsultations(consultationsData || []);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error("Error fetching medical record:", err);
        setError("Impossible de charger votre dossier médical");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalData();
  }, []);

  if (loading && !profile) {
    return <LoadingIndicator message="Chargement du dossier médical..." />;
  }

  return (
    <div className="medical-record-container">
      <h1>Mon Dossier Médical</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {profile && (
        <div className="medical-info-summary">
          <div className="medical-card">
            <h3>Informations médicales</h3>
            <div className="info-row">
              <span className="info-label">Groupe sanguin:</span>
              <span className="info-value">{profile.bloodGroup || "Non renseigné"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Allergies:</span>
              <span className="info-value">{profile.allergies || "Aucune allergie connue"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Conditions chroniques:</span>
              <span className="info-value">{profile.chronicConditions || "Aucune condition connue"}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="consultations-section">
        <h2>Historique des consultations</h2>
        <ConsultationHistory 
          consultations={consultations} 
          role="patient"
        />
      </div>
    </div>
  );
};

export default MedicalRecord;