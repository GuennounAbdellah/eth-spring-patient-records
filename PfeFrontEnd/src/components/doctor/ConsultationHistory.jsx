// src/components/doctor/ConsultationHistory.jsx
const ConsultationHistory = ({ consultations }) => {
    return (
      <div className="consultation-history">
        <h3>Historique des consultations</h3>
        <ul>
          {consultations.map((consultation) => (
            <li key={consultation.id}>
              <p>Date : {consultation.date}</p>
              <p>Motif : {consultation.motif}</p>
              <p>Observations : {consultation.observations}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ConsultationHistory;