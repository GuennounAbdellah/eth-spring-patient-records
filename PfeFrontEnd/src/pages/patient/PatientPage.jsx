import { Outlet, Link } from "react-router-dom";
import "./PatientPage.css";
import logo from "../../assets/images/LOGO.png"; // Import du logo

const PatientPage = () => {
  return (
    <div className="patient-page">
      <nav className="patient-nav">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="sidebar-logo" />
        </div>
        <h2>Espace Patient</h2>
        <ul>
          <li>
            <Link to="/patient/dashboard">Tableau de bord</Link>
          </li>
          <li>
            <Link to="/patient/medical-record">Dossier médical</Link>
          </li>
          <li>
            <Link to="/patient/appointments">Prise de rendez-vous</Link>
          </li>
          <li>
            <Link to="/patient/profile">Profil</Link>
          </li>
        </ul>
      </nav>
      <div className="patient-content">
        <Outlet />
      </div>
    </div>
  );
};

export default PatientPage;
