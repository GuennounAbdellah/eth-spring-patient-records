// src/components/doctor/PrescriptionHistory.jsx
const PrescriptionHistory = ({ prescriptions }) => {
    return (
      <div className="prescription-history">
        <h3>Historique des prescriptions</h3>
        <ul>
          {prescriptions.map((prescription) => (
            <li key={prescription.id}>
              <p>Date : {prescription.date}</p>
              <p>Médicaments : {prescription.medications.join(", ")}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default PrescriptionHistory;