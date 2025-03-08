//import { useState } from "react";
import Logo from "../../assets/images/LOGO.png";
import section from "../../assets/images/section2.png";
import "./homApp.css";
import SignInForm from "./SingInForm";
import Footer from "../../components/layout/Footer";
function App() {
  //const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="hContainer">
        {/* Section principale */}
        <div className="container">
          {/* Colonne gauche */}
          <div className="left">
            <h1>
              <span className="title"> D</span>ossiers
              <span className="title"> M</span>édicales
              <span className="title"> E</span>lectronique
              <span className="title"> S</span>écurisé
            </h1>
            <img src={Logo} alt="Logo" className="logo-image" />
          </div>

          {/* Colonne droite*/}
          <div className="right">
            <SignInForm />

            {/* <div className="separator">
            <hr />
            ou
            <hr />
          </div> */}

            {/* <div className="inscrire">
            <button onClick={() => setIsModalOpen(true)}
             className="btn">Créer un compte</button>
             <ModelFormAjtP 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />
          </div> */}
          </div>
        </div>

        {/* Section 2 */}
        <div className="additional-section">
          <h1 className="section-title">Bienvenue sur DMES</h1>
          <div className="content-wrapper">
            <p className="additional-text">
              <span className="main-expression">DMES </span>
              ou Dossiers Médicales Electronique Sécuriséest une plateforme web
              de <span className="main-expression">Gestion</span> des dossiers
              médicales électronique basée sur la technologie{" "}
              <span className="main-expression">Blockchain</span> a la capacité
              d&apos;agir sur le partage de données cliniques, en stockant les
              données elles-mêmes ou en indiquant les personnes qui peuvent
              accéder à ces données, en garantissant la{" "}
              <span className="main-expression">sécurité</span> et la{" "}
              <span className="main-expression">Confidentialité</span>.<br />
              Aujourd&apos;hui vous pouvez Simplifier la gestion de vos
              informations médicales avec une approche{" "}
              <span className="main-expression">transparente</span> et{" "}
              <span className="main-expression">fiable</span>.
            </p>
            <img
              src={section}
              alt="Blockchain appliquée à la santé"
              className="section-image"
            />
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default App;
