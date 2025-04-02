// src/components/patient/PatientInfo.jsx
const PatientInfo = ({ patient }) => {
    return (
      <div className="patient-info">
        <h3>Informations générales</h3>
        {patient ? (
          <>
            <p>Nom : {patient.nom}</p>
            <p>Prénom : {patient.prenom}</p>
            <p>Date de naissance : {patient.dateOfBirth}</p>
            <p>Sexe : {patient.sexe}</p>
            <p>Groupe sanguin : {patient.bloodGroup || "Non spécifié"}</p>
            <p>Allergies : {patient.allergies?.length > 0 ? patient.allergies.join(", ") : "Aucune"}</p>
          </>
        ) : (
          <div className="placeholder">Informations non disponibles.</div>
        )}
      </div>
    );
  };
  
  export default PatientInfo;