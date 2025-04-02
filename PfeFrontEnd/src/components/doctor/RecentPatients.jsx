// src/components/doctor/RecentPatients.jsx
import { Link } from "react-router-dom";

const RecentPatients = ({ patients }) => {
  if (!patients || patients.length === 0) {
    return <div>Aucun patient récent à afficher.</div>;
  }

  return (
    <div className="recent-patients">
      <h3>Derniers patients consultés</h3>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            <Link to={`/doctor/patient/${patient.id}`}>
              {patient.nom} {patient.prenom}
            </Link>
            <span> - Dernière consultation : {patient.lastConsultation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentPatients;