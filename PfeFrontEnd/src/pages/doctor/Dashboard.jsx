import React, { useState, useEffect } from "react";
import { dashboardService } from "../../services/dashboardService";
import StatsCard from "../../components/common/StatsCard";
import { MdPeople, MdLocalHospital, MdHistory } from "react-icons/md";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./Dashboard.css";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    recentConsultations: 0,
    upcomingConsultations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getDoctorDashboardData();
        
        setStats({
          totalPatients: data.totalPatients || 0,
          recentConsultations: data.recentConsultations || 0,
          upcomingConsultations: data.upcomingConsultations || 0,
        });
        
        setError(null);
      } catch (err) {
        console.error("Error fetching doctor dashboard data:", err);
        setError("Impossible de charger les données du tableau de bord");
        
        // Set default stats to avoid null references
        setStats({
          totalPatients: 0,
          recentConsultations: 0,
          upcomingConsultations: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="doctor-dashboard">
      <h1>Tableau de Bord Médecin</h1>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="stats-grid">
        <StatsCard 
          title="Patients" 
          value={stats.totalPatients} 
          icon={<MdPeople size={24} />} 
          color="primary"
        />
        <StatsCard 
          title="Consultations récentes" 
          value={stats.recentConsultations} 
          icon={<MdHistory size={24} />} 
          color="info"
        />
        <StatsCard 
          title="Consultations à venir" 
          value={stats.upcomingConsultations} 
          icon={<MdLocalHospital size={24} />} 
          color="success"
        />
      </div>
      
      <div className="dashboard-sections">
        <section className="recent-activity">
          <h2>Activités Récentes</h2>
          <div className="activity-list">
            {/* Activity items could go here */}
            <p className="empty-state">Aucune activité récente à afficher.</p>
          </div>
        </section>
        
        <section className="doctor-notes">
          <h2>Notes Personnelles</h2>
          <div className="notes-container">
            <textarea 
              className="doctor-notes-input"
              placeholder="Écrivez vos notes ici..."
            />
            <button className="save-notes-btn">Enregistrer</button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;