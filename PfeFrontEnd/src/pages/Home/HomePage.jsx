import Logo from "../../assets/images/LOGO.png";
import section from "../../assets/images/section2.png";
import "./homApp.css";
import LogInForm from "./LogInForm";
import Footer from "../../components/layout/Footer";

function HomePage() {
  return (
    <div className="app-container">
      <main className="main-content">
        <div className="auth-container">
          <div className="branding-section">
            <h1 className="main-title">
              <span className="title-accent">D</span>ossiers 
              <span className="title-accent">M</span>édicales 
              <span className="title-accent">E</span>lectronique 
              <span className="title-accent">S</span>écurisé
            </h1>
            <img src={Logo} alt="DMES Logo" className="logo-image" />
          </div>
          <div className="auth-section">
            <LogInForm />
          </div>
        </div>
        
        <section className="info-section">
          <h2 className="section-title">Bienvenue sur DMES</h2>
          <div className="content-wrapper">
            <article className="info-text">
              <p>
                <span className="highlight">DMES</span> ou Dossiers Médicales Electronique Sécurisé est une plateforme web
                de <span className="highlight">Gestion</span> des dossiers médicales électronique basée sur la technologie{" "}
                <span className="highlight">Blockchain</span> a la capacité d'agir sur le partage de données cliniques, en stockant les
                données elles-mêmes ou en indiquant les personnes qui peuvent accéder à ces données, en garantissant la{" "}
                <span className="highlight">sécurité</span> et la{" "}
                <span className="highlight">Confidentialité</span>.
              </p>
              <p>
                Aujourd'hui vous pouvez Simplifier la gestion de vos informations médicales avec une approche{" "}
                <span className="highlight">transparente</span> et{" "}
                <span className="highlight">fiable</span>.
              </p>
            </article>
            <figure className="info-image-container">
              <img
                src={section}
                alt="Blockchain appliquée à la santé"
                className="info-image"
              />
            </figure>
          </div>
        </section>
        <Footer />

      </main>
      
    </div>
  );
}

export default HomePage;