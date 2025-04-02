// src/components/doctor/MedicalData.jsx
const MedicalData = ({ data }) => {
    return (
      <div className="medical-data">
        <h3>Données médicales</h3>
        <p>Groupe sanguin : {data.bloodGroup}</p>
        <p>Traitement en cours : {data.currentTreatments.join(", ")}</p>
        <p>Résultats d’analyses : {data.testResults}</p>
      </div>
    );
  };
  
  export default MedicalData;