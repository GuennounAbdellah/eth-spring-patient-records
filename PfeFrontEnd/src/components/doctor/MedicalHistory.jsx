// src/components/doctor/MedicalHistory.jsx
const MedicalHistory = ({ history }) => {
    return (
      <div className="medical-history">
        <h3>Historique médical</h3>
        <p>Pathologies : {history.pathologies.join(", ")}</p>
        <p>Allergies : {history.allergies.join(", ")}</p>
        <p>Antécédents familiaux : {history.familyHistory.join(", ")}</p>
      </div>
    );
  };
  
  export default MedicalHistory;