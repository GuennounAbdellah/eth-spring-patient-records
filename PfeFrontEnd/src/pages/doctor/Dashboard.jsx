
import { useState, useEffect } from "react";
import StatsCard from "../../components/doctor/StatsCard";
import RecentPatients from "../../components/doctor/RecentPatients";
import AppointmentCalendar from "../../components/doctor/AppointmentCalendar";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsResponse = await fetch("http://localhost:8080/api/doctor/stats");
        if (!statsResponse.ok) throw new Error("Erreur lors de la récupération des statistiques");
        const statsData = await statsResponse.json();
        setStats([
          { title: "Patients suivis", value: statsData.patientsCount, icon: "👥" },
          { title: "Consultations récentes", value: statsData.recentConsultations, icon: "📅" },
          { title: "Dossiers modifiés", value: statsData.modifiedRecords, icon: "📝" },
        ]);

        const patientsResponse = await fetch("http://localhost:8080/api/doctor/recent-patients");
        if (!patientsResponse.ok) throw new Error("Erreur lors de la récupération des patients");
        const patientsData = await patientsResponse.json();
        setRecentPatients(patientsData);

        const appointmentsResponse = await fetch("http://localhost:8080/api/doctor/appointments");
        if (!appointmentsResponse.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

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
      <div className="stats-grid">
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <StatsCard key={index} title={stat.title} value={stat.value} icon={stat.icon} />
          ))
        ) : (
          <div className="placeholder">
            <p>Aucune statistique disponible pour le moment.</p>
          </div>
        )}
      </div>
      <div className="dashboard-content">
        <div>
          <RecentPatients patients={recentPatients} />
        </div>
        <div>
          <AppointmentCalendar appointments={appointments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;