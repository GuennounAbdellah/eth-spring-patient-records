// src/components/doctor/RecentPatients.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./RecentPatients.css";

const RecentPatients = ({ patients = [] }) => {
  if (!patients || patients.length === 0) {
    return (
      <div className="empty-recent-patients">
        <p>Aucun patient n'a encore accordé d'accès à ses dossiers médicaux</p>
        <small>Les patients doivent vous accorder explicitement l'accès à leurs données blockchain</small>
      </div>
    );
  }

  return (
    <div className="recent-patients">
      <table className="patients-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Identifiant</th> 
            <th>Groupe sanguin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id || patient.userId}>
              <td className="patient-name">{patient.fullName || patient.username}</td>
              <td className="patient-id">{patient.walletAddress ? 
                `${patient.walletAddress.substring(0, 6)}...${patient.walletAddress.substring(patient.walletAddress.length - 4)}` : 
                "Non renseigné"}
              </td>
              <td className="patient-blood-group">{patient.bloodGroup || "Non renseigné"}</td>
              <td>
                <Link to={`/doctor/patient/${patient.id || patient.userId}`} className="view-patient-btn">
                  Voir dossier
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RecentPatients.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      userId: PropTypes.string,
      username: PropTypes.string,
      fullName: PropTypes.string,
      walletAddress: PropTypes.string,
      bloodGroup: PropTypes.string,
    })
  ),
};

export default RecentPatients;