
import { useState, useEffect } from "react";
import PatientList from "../../components/doctor/PatientList";
import "./Patients.css";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/doctor/patients");
        if (!response.ok) throw new Error("Erreur lors de la récupération des patients");
        const data = await response.json();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="patients">
      <h1>Gestion des patients</h1>
      {error && <div className="error-message">{error}</div>}
      <PatientList patients={patients} />
    </div>
  );
};

export default Patients;