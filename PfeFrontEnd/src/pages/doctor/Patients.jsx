import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dashboardService } from "../../services/dashboardService";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./Patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getDoctorPatients();
        
        const processedPatients = data.map(patient => ({
          ...patient,
          id: patient.id || patient.userId,
          fullName: patient.fullName || patient.username
        }));
        
        setPatients(processedPatients);
        setFilteredPatients(processedPatients);
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement des patients");
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter patients when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (patient.fullName && 
            patient.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <LoadingIndicator message="Chargement des patients..." />;

  return (
    <div className="patients-container">
      <h2>Mes Patients</h2>
      <p>Liste des patients qui vous ont accordé l'accès à leurs dossiers médicaux.</p>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="patients-search">
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="patient-list">
        {filteredPatients.length > 0 ? (
          <table className="patient-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Identifiant Blockchain</th>
                <th>Groupe sanguin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.fullName}</td>
                  <td className="wallet-address">
                    {patient.walletAddress ? 
                      `${patient.walletAddress.substring(0, 6)}...${patient.walletAddress.substring(patient.walletAddress.length - 4)}` : 
                      'Non défini'}
                  </td>
                  <td>{patient.bloodGroup || 'Non défini'}</td>
                  <td>
                    <Link 
                      to={`/doctor/patient/${patient.id}`} 
                      className="view-button"
                    >
                      Voir le dossier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-patients">
            {searchTerm ? 
              "Aucun patient ne correspond à votre recherche." : 
              "Vous n'avez pas encore de patients."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;