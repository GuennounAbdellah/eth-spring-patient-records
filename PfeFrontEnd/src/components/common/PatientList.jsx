import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import "./PatientList.css";

const PatientList = ({ patients, loading, error }) => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("fullName"); // Default sort by name

  const filteredPatients = patients
    ? patients.filter(
        (patient) =>
          patient.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          patient.username?.toLowerCase().includes(search.toLowerCase()) ||
          patient.medicalRecordNumber?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Sort patients based on selected criteria
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortBy === "fullName") {
      return a.fullName?.localeCompare(b.fullName);
    } else if (sortBy === "username") {
      return a.username?.localeCompare(b.username);
    } else if (sortBy === "medicalRecordNumber") {
      return a.medicalRecordNumber?.localeCompare(b.medicalRecordNumber);
    }
    return 0;
  });

  if (loading) {
    return <div className="patient-list-loading">Chargement des patients...</div>;
  }

  if (error) {
    return <div className="patient-list-error">{error}</div>;
  }

  return (
    <div className="patient-list-container">
      <div className="patient-list-header">
        <h3>Liste des patients</h3>
        <div className="patient-list-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="patient-search"
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <div className="sort-control">
            <label htmlFor="sortBy">Trier par:</label>
            <select 
              id="sortBy" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="fullName">Nom</option>
              <option value="username">Nom d'utilisateur</option>
              <option value="medicalRecordNumber">Numéro de dossier</option>
            </select>
          </div>
        </div>
      </div>

      {sortedPatients.length > 0 ? (
        <div className="patient-table-container">
          <table className="patient-table">
            <thead>
              <tr>
                <th>Nom complet</th>
                <th>Nom d'utilisateur</th>
                <th>Numéro de dossier</th>
                <th>Groupe sanguin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.fullName}</td>
                  <td>{patient.username}</td>
                  <td>{patient.medicalRecordNumber}</td>
                  <td>{patient.bloodGroup || "Non spécifié"}</td>
                  <td className="table-actions">
                    <Link 
                      to={`/doctor/patient/${patient.id}`} 
                      className="view-patient-btn"
                    >
                      Voir dossier
                    </Link>
                    <Link
                      to={`/doctor/add-consultation/${patient.id}`}
                      className="add-consultation-btn"
                    >
                      Nouvelle consultation
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-patient-list">
          {search ? (
            <p>Aucun patient ne correspond à votre recherche.</p>
          ) : (
            <p>Aucun patient à afficher pour le moment.</p>
          )}
        </div>
      )}
    </div>
  );
};

PatientList.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      medicalRecordNumber: PropTypes.string,
      bloodGroup: PropTypes.string
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string
};

PatientList.defaultProps = {
  patients: [],
  loading: false
};

export default PatientList;