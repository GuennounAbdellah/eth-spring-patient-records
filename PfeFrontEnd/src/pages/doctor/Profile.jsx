
import { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/doctor/profile");
        if (!response.ok) throw new Error("Erreur lors de la récupération du profil");
        const data = await response.json();
        setDoctor(data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="profile">
      <h1>Profil</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="profile-details">
        <h3>Informations personnelles</h3>
        {doctor ? (
          <>
            <p>Nom : {doctor.nom}</p>
            <p>Prénom : {doctor.prenom}</p>
            <p>Email : {doctor.email}</p>
            <p>Spécialité : {doctor.specialite}</p>
            <p>Numéro d’identification : {doctor.numeroIdentification}</p>
            <p>Adresse de pratique : {doctor.adressePratique}</p>
            <p>Numéro de téléphone : {doctor.numeroTelephone}</p>
            <p>Hôpital : {doctor.nomHopital}</p>
            <p>Ville : {doctor.ville}</p>
          </>
        ) : (
          <div className="placeholder">Informations du profil non disponibles.</div>
        )}
      </div>
    </div>
  );
};

export default Profile;