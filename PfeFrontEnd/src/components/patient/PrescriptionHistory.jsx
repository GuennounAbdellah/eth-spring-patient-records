// src/components/patient/PrescriptionHistory.jsx
const PrescriptionHistory = ({ prescriptions }) => {
    return (
      <div className="prescription-history">
        <h3>Prescriptions médicales</h3>
        {prescriptions?.length > 0 ? (
          <table className="prescription-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Médicaments</th>
                <th>Durée</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td>{prescription.date}</td>
                  <td>{prescription.medications.join(", ")}</td>
                  <td>{prescription.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="placeholder">Aucune prescription enregistrée.</div>
        )}
      </div>
    );
  };
  
  export default PrescriptionHistory;