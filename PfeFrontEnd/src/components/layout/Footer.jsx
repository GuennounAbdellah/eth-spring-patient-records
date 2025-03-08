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



// import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
// import './Footer.css';

// const Footer = () => {
//   return (
//     <footer className="footer">
//       <div className="footer-container">
//         <div className="footer-grid">
//           {/* Company Info */}
//           <div className="footer-section">
//             <h3 className="footer-title">Notre Entreprise</h3>
//             <p className="footer-text">Votre santé, notre priorité.</p>
//             <div className="social-icons">
//               <Facebook className="social-icon" />
//               <Twitter className="social-icon" />
//               <Instagram className="social-icon" />
//             </div>
//           </div>

//           {/* Contact Info */}
//           <div className="footer-section">
//             <h3 className="footer-title">Contact</h3>
//             <div className="contact-info">
//               <div className="contact-item">
//                 <Mail className="contact-icon" />
//                 <span>contact@example.com</span>
//               </div>
//               <div className="contact-item">
//                 <Phone className="contact-icon" />
//                 <span>+33 1 23 45 67 89</span>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* Bottom Bar */}
//         <div className="footer-bottom">
//           <p>© {new Date().getFullYear()} DMES. Tous droits réservés.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;