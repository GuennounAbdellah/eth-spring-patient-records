// src/pages/admin/AdminAddPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./dashboard/Dashboard.jsx";
import UserTable from "./users/UserTable.jsx";
import AuditPage from "./audit/AuditPage.jsx";
import SettingsPage from "./settings/ProfilePage.jsx";
import "./admin.css";
import "./users/UserTable.css";
import "./users/AddUserDialog.css"
import logo from "../../assets/images/LOGO.png";
import Footer from "../../components/layout/Footer";


const AdminAddPage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    setIsLogoutDialogOpen(false);
  };

  const cancelLogout = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <div className="acontainer">
      <div className="sidebar">
      <div className="logo-container">
     <img src={logo} alt="Logo" className="sidebar-logo" />
     </div>
     <h2>Admin</h2>

        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            Tableau de bord
          </li>
          <li
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            Gestion des utilisateurs
          </li>
          <li
            className={activeSection === "audit" ? "active" : ""}
            onClick={() => setActiveSection("audit")}
          >
            Logs Blockchain
          </li>
          <li
            className={activeSection === "settings" ? "active" : ""}
            onClick={() => setActiveSection("settings")}
          >
            Profil
          </li>
          <li onClick={handleLogout} className="logout-btn">
            Déconnexion
          </li>
        </ul>
      </div>
      <div className="acontent">
        {activeSection === "dashboard" && <Dashboard />}
        {activeSection === "users" && <UserTable />}
        {activeSection === "audit" && <AuditPage />}
        {activeSection === "settings" && <SettingsPage />}
      </div>
     

      {isLogoutDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Confirmer la déconnexion</h3>
              <button className="close-btn" onClick={cancelLogout}>×</button>
            </div>
            <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
            <div className="dialog-actions">
              <button className="cancel-btn" onClick={cancelLogout}>
                Annuler
              </button>
              <button className="submit-btn" onClick={confirmLogout}>
                déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
        
    </div>
    
  );
};

export default AdminAddPage;