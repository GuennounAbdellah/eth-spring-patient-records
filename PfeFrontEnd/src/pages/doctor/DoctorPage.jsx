import { Outlet, Link } from "react-router-dom";
import "./DoctorPage.css";
import logo from "../../assets/images/LOGO.png"; // Logo
import Footer from "../../components/layout/Footer"; // Footer

const DoctorPage = () => {
  return (
    <div className="doctor-container">
      <div className="sidebar">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <h2>Espace Docteur</h2>
        <ul>
          <li className="nav-item">
            <Link to="/doctor/dashboard">Tableau de bord</Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/patients">Patients</Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/appointments">Rendez-vous</Link>
          </li>
          <li className="nav-item">
            <Link to="/doctor/profile">Profil</Link>
          </li>
          <li className="logout-btn">Déconnexion</li>
        </ul>
      </div>
      
      <div className="content">
        <Outlet />
      </div>

    
    </div>
  );
};

export default DoctorPage;
