
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    patients: 0,
    medicalRecords: 0,
    blockchainTransactions: 0,
  });
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    // Récupérer les statistiques
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/stats");
        const data = await response.json();
        setStats({
          doctors: data.doctors || 0,
          patients: data.patients || 0,
          medicalRecords: data.medicalRecords || 0,
          blockchainTransactions: data.blockchainTransactions || 0,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des stats", error);
      }
    };

    // Récupérer les données pour le graphique (activité des 7 derniers jours)
    const fetchActivity = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/activity");
        const data = await response.json();
        setActivityData(data); // Exemple : [{ day: "Lun", blockchainTransactions: 30 }, ...]
      } catch (error) {
        console.error("Erreur lors de la récupération de l'activité", error);
      }
    };

    fetchStats();
    fetchActivity();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Tableau de bord médical</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Médecins enregistrés</h3>
          <p>{stats.doctors}</p>
        </div>
        <div className="stat-card">
          <h3>Patients inscrits</h3>
          <p>{stats.patients}</p>
        </div>
        <div className="stat-card">
          <h3>Dossiers médicaux</h3>
          <p>{stats.medicalRecords}</p>
        </div>
        <div className="stat-card">
          <h3>Transactions blockchain</h3>
          <p>{stats.blockchainTransactions}</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Activité blockchain en temps réel</h3>
        <LineChart width={600} height={300} data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="blockchainTransactions" stroke="#8884d8" name="Transactions" />
        </LineChart>
      </div>
    </div>
  );
};

export default Dashboard;