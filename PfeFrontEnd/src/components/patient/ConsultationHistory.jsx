// src/components/patient/ConsultationHistory.jsx
const ConsultationHistory = ({ consultations }) => {
    return (
      <div className="consultation-history">
        <h3>Historique des consultations</h3>
        {consultations?.length > 0 ? (
          <table className="consultation-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Motif</th>
                <th>Diagnostic</th>
                <th>Médecin</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consultation) => (
                <tr key={consultation.id}>
                  <td>{consultation.date}</td>
                  <td>{consultation.motif}</td>
                  <td>{consultation.diagnostic}</td>
                  <td>{consultation.doctor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="placeholder">Aucune consultation enregistrée.</div>
        )}
      </div>
    );
  };
  
  export default ConsultationHistory;