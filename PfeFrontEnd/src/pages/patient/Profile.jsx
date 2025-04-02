
import { useState, useEffect } from "react";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/patient/profile");
        if (!response.ok) throw new Error("Erreur lors de la récupération du profil");
        const data = await response.json();
        setProfile(data);
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone,
          adresse: data.adresse,
        });
        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/patient/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil");
      setProfile(formData);
      setIsEditing(false);
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      console.error(err.message);
      alert("Erreur lors de la mise à jour du profil. Veuillez vérifier que le backend est en cours d'exécution.");
    }
  };

  const handleCancel = () => {
    setFormData({
      nom: profile.nom,
      prenom: profile.prenom,
      email: profile.email,
      telephone: profile.telephone,
      adresse: profile.adresse,
    });
    setIsEditing(false);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="profile">
      <h1>Profil</h1>
      {error && <div className="error-message">{error}</div>}
      {profile && !isEditing ? (
        <div className="profile-details">
          <h3>Informations personnelles</h3>
          <p>Nom : {profile.nom}</p>
          <p>Prénom : {profile.prenom}</p>
          <p>Email : {profile.email}</p>
          <p>Téléphone : {profile.telephone}</p>
          <p>Adresse : {profile.adresse}</p>
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Modifier
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <h3>Modifier le profil</h3>
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Adresse</label>
            <textarea
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="save-button">Enregistrer</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Annuler</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;