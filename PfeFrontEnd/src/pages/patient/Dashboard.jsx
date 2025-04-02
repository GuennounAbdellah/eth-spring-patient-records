
import { useState, useEffect } from "react";
import MedicalSummary from "../../components/patient/MedicalSummary";
import RecentAppointments from "../../components/patient/RecentAppointments";
import MedicalDocuments from "../../components/patient/MedicalDocuments";
import "./Dashboard.css";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await fetch("http://localhost:8080/api/patient/medical-summary");
        if (!summaryResponse.ok) throw new Error("Erreur lors de la récupération du résumé médical");
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);

        const appointmentsResponse = await fetch("http://localhost:8080/api/patient/recent-appointments");
        if (!appointmentsResponse.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

        const documentsResponse = await fetch("http://localhost:8080/api/patient/documents");
        if (!documentsResponse.ok) throw new Error("Erreur lors de la récupération des documents");
        const documentsData = await documentsResponse.json();
        setDocuments(documentsData);

        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="dashboard-content">
        <MedicalSummary summary={summary} />
        <RecentAppointments appointments={appointments} />
        <MedicalDocuments documents={documents} />
      </div>
    </div>
  );
};

export default Dashboard;