// src/components/doctor/PatientInfo.jsx
const PatientInfo = ({ patient }) => {
    return (
      <div className="patient-info">
        <h3>Informations générales</h3>
        <p>Nom : {patient.nom}</p>
        <p>Prénom : {patient.prenom}</p>
        <p>Âge : {patient.age}</p>
        <p>Sexe : {patient.sexe}</p>
        <p>Adresse : {patient.adresse}</p>
        <p>Téléphone : {patient.telephone}</p>
      </div>
    );
  };
  
  export default PatientInfo;