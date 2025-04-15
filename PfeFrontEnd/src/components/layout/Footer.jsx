import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>À propos</h3>
          <p>Plateforme sécurisée de gestion des dossiers médicaux avec blockchain.</p>
        </div>


        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email : <a href="mailto:support@DMES.com">support@DMES.com</a></p>
          <p>Téléphone : +33 1 23 45 67 89</p>
        </div>

        <div className="footer-section">
          <h3>Suivez-nous</h3>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 DMES. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;