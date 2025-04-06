import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import StatsCard from '../../../components/common/StatsCard';
import { MdPeople, MdLocalHospital, MdPerson, MdWarning } from 'react-icons/md';
import ErrorMessage from '../../../components/common/ErrorMessage';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDoctors: 0,
    totalPatients: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get all users
      const allUsers = await userService.getAllUsers();
      
      // Get role-specific users
      const doctors = await userService.getUsersByRole('DOCTOR');
      const patients = await userService.getUsersByRole('PATIENT');
      
      // Calculate stats
      setStats({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter(user => user.active).length,
        totalDoctors: doctors.length,
        totalPatients: patients.length
      });
      
      setError(null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Impossible de charger les données du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="admin-dashboard">
      <h1>Tableau de Bord Administrateur</h1>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="stats-grid">
        <StatsCard 
          title="Utilisateurs Total" 
          value={stats.totalUsers} 
          icon={<MdPeople size={24} />} 
          color="primary"
        />
        <StatsCard 
          title="Utilisateurs Actifs" 
          value={stats.activeUsers} 
          icon={<MdPerson size={24} />} 
          color="success"
        />
        <StatsCard 
          title="Médecins" 
          value={stats.totalDoctors} 
          icon={<MdLocalHospital size={24} />} 
          color="info"
        />
        <StatsCard 
          title="Patients" 
          value={stats.totalPatients} 
          icon={<MdPerson size={24} />} 
          color="warning"
        />
      </div>
      
      <div className="dashboard-sections">
        <section className="recent-activity">
          <h2>Activités Récentes</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">
                <MdPerson size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Nouvel utilisateur enregistré</div>
                <div className="activity-time">Il y a 2 heures</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">
                <MdLocalHospital size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Nouveau médecin approuvé</div>
                <div className="activity-time">Il y a 5 heures</div>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon warning">
                <MdWarning size={20} />
              </div>
              <div className="activity-content">
                <div className="activity-title">Tentative d'accès non autorisée</div>
                <div className="activity-time">Il y a 1 jour</div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="system-health">
          <h2>État du Système</h2>
          <div className="health-metrics">
            <div className="metric">
              <div className="metric-label">Blockchain Status</div>
              <div className="metric-value healthy">En Ligne</div>
            </div>
            <div className="metric">
              <div className="metric-label">Database</div>
              <div className="metric-value healthy">En Ligne</div>
            </div>
            <div className="metric">
              <div className="metric-label">API Response Time</div>
              <div className="metric-value">245ms</div>
            </div>
            <div className="metric">
              <div className="metric-label">Storage Usage</div>
              <div className="metric-value">62%</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;