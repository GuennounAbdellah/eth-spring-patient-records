// src/components/patient/MedicalSummary.jsx
const MedicalSummary = ({ summary }) => {
    return (
      <div className="medical-summary">
        <h3>Résumé du dossier médical</h3>
        {summary ? (
          <>
            <p>Groupe sanguin : {summary.bloodGroup || "Non spécifié"}</p>
            <p>Pathologies : {summary.pathologies?.length > 0 ? summary.pathologies.join(", ") : "Aucune"}</p>
            <p>Traitement en cours : {summary.currentTreatments?.length > 0 ? summary.currentTreatments.join(", ") : "Aucun"}</p>
          </>
        ) : (
          <div className="placeholder">Aucune information médicale disponible.</div>
        )}
      </div>
    );
  };
  
  export default MedicalSummary;