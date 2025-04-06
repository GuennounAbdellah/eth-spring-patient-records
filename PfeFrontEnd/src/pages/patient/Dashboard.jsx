import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { patientService } from "../../services/patientService";
import { consultationService } from "../../services/consultationService";
import { permissionService } from "../../services/permissionService";
import BlockchainHistory from "../../components/patient/BlockchainHistory";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    profile: null,
    recentConsultations: [],
    authorizedDoctors: [],
    blockchainTransactions: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Track which data sources had errors
        const errors = [];
        
        // Fetch all data in parallel with individual error handling
        const [profileResult, consultationsResult, doctorsResult] = 
          await Promise.allSettled([
            patientService.getProfile(),
            patientService.getConsultations(),
            patientService.getAuthorizedDoctors()
          ]);
        
        // Process results and collect any errors
        const results = {
          profile: null,
          recentConsultations: [],
          authorizedDoctors: [],
          blockchainTransactions: [] // This would come from blockchain service
        };
        
        if (profileResult.status === 'fulfilled') {
          results.profile = profileResult.value;
        } else {
          errors.push("profil");
          console.error("Profile fetch error:", profileResult.reason);
        }
        
        if (consultationsResult.status === 'fulfilled') {
          results.recentConsultations = consultationsResult.value
            .sort((a, b) => new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date))
            .slice(0, 5);
        } else {
          errors.push("consultations");
          console.error("Consultations fetch error:", consultationsResult.reason);
        }
        
        if (doctorsResult.status === 'fulfilled') {
          results.authorizedDoctors = doctorsResult.value;
        } else {
          errors.push("médecins");
          console.error("Doctors fetch error:", doctorsResult.reason);
        }

        // Mock blockchain transactions (replace with actual blockchain data)
        results.blockchainTransactions = [
          {
            hash: "0x1234567890abcdef1234567890abcdef",
            timestamp: Date.now() / 1000 - 3600,
            action: "Ajout de consultation",
            status: "success"
          },
          {
            hash: "0xabcdef1234567890abcdef1234567890",
            timestamp: Date.now() / 1000 - 86400,
            action: "Accès accordé à Dr. Martin",
            status: "success"
          }
        ];
        
        // Update state with whatever data we could fetch
        setDashboardData(results);
        
        // Set error message if any data failed to load
        if (errors.length > 0) {
          setError(`Impossible de charger certaines données: ${errors.join(', ')}`);
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Impossible de charger les données du tableau de bord");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading && !dashboardData.profile) {
    return <LoadingIndicator message="Chargement du tableau de bord..." />;
  }

  return (
    <div className="dashboard-container">
      <h1>Bienvenue, {dashboardData.profile?.username || "Patient"}</h1>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="dashboard-summary">
        <div className="dashboard-card">
          <h3>Consultations récentes</h3>
          {dashboardData.recentConsultations && dashboardData.recentConsultations.length > 0 ? (
            <ul className="consultation-list">
              {dashboardData.recentConsultations.map((consultation, index) => (
                <li key={consultation.timestamp || `consultation-${index}`} className="consultation-item">
                  <div className="consultation-date">
                    {new Date(consultation.timestamp || consultation.date).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="consultation-doctor">
                    Dr. {consultation.doctorId || consultation.doctorName || "Inconnu"}
                  </div>
                  <div className="consultation-diagnosis">
                    {consultation.details || consultation.diagnosis || "Pas de diagnostic disponible"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Aucune consultation récente</p>
          )}
          <div className="card-action">
            <Link to="/patient/medical-record" className="action-link">Voir mon dossier médical</Link>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h3>Médecins autorisés</h3>
          {dashboardData.authorizedDoctors && dashboardData.authorizedDoctors.length > 0 ? (
            <ul className="doctors-list">
              {dashboardData.authorizedDoctors.map((doctor, index) => (
                <li key={doctor.userId || `doctor-${index}`} className="doctor-item">
                  <div className="doctor-name">
                    {doctor.username}
                  </div>
                  {doctor.specialization && (
                    <div className="doctor-specialization">
                      {doctor.specialization}
                    </div>
                  )}
                  {doctor.hospitalAffiliation && (
                    <div className="doctor-hospital">
                      {doctor.hospitalAffiliation}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Aucun médecin n'a accès à vos données</p>
          )}
          <div className="card-action">
            <Link to="/patient/doctor-access" className="action-link">Gérer les accès</Link>
          </div>
        </div>
      </div>

      <div className="blockchain-section">
        <h2>Activité blockchain récente</h2>
        <BlockchainHistory history={dashboardData.blockchainTransactions} />
      </div>
    </div>
  );
};

export default Dashboard;