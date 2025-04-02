// src/components/patient/MedicalHistory.jsx
const MedicalHistory = ({ history }) => {
    return (
      <div className="medical-history">
        <h3>Historique médical</h3>
        {history ? (
          <>
            <p>Pathologies : {history.pathologies?.length > 0 ? history.pathologies.join(", ") : "Aucune"}</p>
            <p>Vaccinations : {history.vaccinations?.length > 0 ? history.vaccinations.join(", ") : "Aucune"}</p>
            <p>Interventions chirurgicales : {history.surgeries?.length > 0 ? history.surgeries.join(", ") : "Aucune"}</p>
          </>
        ) : (
          <div className="placeholder">Historique médical non disponible.</div>
        )}
      </div>
    );
  };
  
  export default MedicalHistory;