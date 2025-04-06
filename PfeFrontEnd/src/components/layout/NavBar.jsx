import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/LOGO.png';
import './NavBar.css';
import { useAuth } from '../../context/AuthContext';

import { MdDashboard, MdPerson, MdPeople, MdLock, MdAssignment } from 'react-icons/md';
import { FaUserMd, FaFileMedical } from 'react-icons/fa';
import { AiOutlineFileText } from 'react-icons/ai';


export default function NavBar({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  // Get navigation items based on user role
  const navItems = getNavItems(userRole);

  // Generate list items from navigation items
  const ListGenerator = navItems.map((element) => (
    <li className="list-item" key={element.name}>
      <Link to={element.path || '#'} className="list-link">
        <span className="nav-list-icon">{element.icon || '📋'}</span>
        {element.name}
      </Link>
    </li>
  ));

  return (
    <div className="nav-container">
      <div className="nav-top">
        <img src={Logo} alt="image logo" />
        <ul className="nav-list">{ListGenerator}</ul>
      </div>
      <button className='deconnexion-button' onClick={openDialog}>Déconnexion</button>
      {isOpen && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2 className="dialog-title">Confirmation de déconnexion</h2>
            <p className="dialog-message">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="dialog-buttons">
              <button className="confirm-button" onClick={handleLogout}>
                Confirmer
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get navigation items based on user role
function getNavItems(role) {
  switch (role) {
    case 'patient':
      return [
        { name: "Tableau de bord", icon: <MdDashboard />, path: "/patient/dashboard" },
        { name: "Mon dossier médical", icon: <FaFileMedical />, path: "/patient/medical-record" },
        { name: "Accès médecins", icon: <MdLock />, path: "/patient/doctor-access" },
        { name: "Mon profil", icon: <MdPerson />, path: "/patient/profile" },
      ];
    case 'doctor':
      return [
        { name: "Tableau de bord", icon: <MdDashboard />, path: "/doctor/dashboard" },
        { name: "Mes patients", icon: <MdPeople />, path: "/doctor/patients" },
        { name: "Mon profil", icon: <MdPerson />, path: "/doctor/profile" },
      ];
    case 'admin':
      return [
        { name: "Tableau de bord", icon: <MdDashboard />, path: "/admin/dashboard" },
        { name: "Gestion utilisateurs", icon: <MdPeople />, path: "/admin/users" },
        { name: "Journal blockchain", icon: <AiOutlineFileText />, path: "/admin/audit" },
        { name: "Mon profil", icon: <MdPerson />, path: "/admin/profile" },
      ];
    default:
      return [
        { name: "Tableau de bord", icon: <MdDashboard />, path: "/" },
      ];
  }
  
}

NavBar.propTypes = {
  userRole: PropTypes.string.isRequired,
};