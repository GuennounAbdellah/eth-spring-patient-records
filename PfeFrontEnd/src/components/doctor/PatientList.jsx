// src/components/doctor/PatientList.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

const PatientList = ({ patients }) => {
  const [search, setSearch] = useState("");
  const [filterPathology, setFilterPathology] = useState("");

  const filteredPatients = patients
    ? patients.filter(
        (patient) =>
          (patient.nom.toLowerCase().includes(search.toLowerCase()) ||
            patient.prenom.toLowerCase().includes(search.toLowerCase())) &&
          (filterPathology === "" || patient.pathology === filterPathology)
      )
    : [];

  return (
    <div className="patient-list">
      <h3>Liste des patients</h3>
      <input
        type="text"
        placeholder="Rechercher un patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setFilterPathology(e.target.value)}>
        <option value="">Filtrer par pathologie</option>
        <option value="Diabète">Diabète</option>
        <option value="Hypertension">Hypertension</option>
        <option value="Asthme">Asthme</option>
      </select>
      {filteredPatients.length > 0 ? (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Pathologie</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>
                  <Link to={`/doctor/patient/${patient.id}`}>{patient.nom}</Link>
                </td>
                <td>{patient.prenom}</td>
                <td>{patient.pathology}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="placeholder">Aucun patient à afficher pour le moment.</div>
      )}
    </div>
  );
};

export default PatientList;