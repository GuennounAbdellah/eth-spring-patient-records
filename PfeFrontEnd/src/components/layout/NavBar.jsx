import  { useState, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/LOGO.png';
import './NavBar.css';

export default function NavBar(props) {
  const { icons } = props;
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const openDialog = () => {
    setIsOpen(true);
  };

  const ListGenerator = icons.content.map((element) => {
    return (
      <li className="list-item" key={element.name}>
        {cloneElement(element.icon, { className: "nav-list-icon" })}
        {element.name}
      </li>
    );
  });

  return (
    <div className="nav-container">
      <div className="nav-top">
        <img src={Logo} alt="image logo" />
        <ul className="nav-list">{ListGenerator}</ul>
      </div>
      <button className='deconnexion-button' onClick={openDialog}>déconnexion</button>
      {isOpen && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h2 className="dialog-title">Confirmation de déconnexion</h2>
            <p className="dialog-message">
              Êtes-vous sûr de vouloir vous déconnecter ?
            </p>
            <div className="dialog-buttons">
              <Link to="/">
                <button className="confirm-button" onClick={handleLogout}>
                  Confirmer
                </button>
              </Link>
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

NavBar.propTypes = {
  icons: PropTypes.shape({
    content: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        icon: PropTypes.element.isRequired,
      })
    ).isRequired,
  }).isRequired,
};