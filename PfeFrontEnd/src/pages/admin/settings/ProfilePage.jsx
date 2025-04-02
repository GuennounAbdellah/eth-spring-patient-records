
import { useState, useEffect } from "react";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    nom: "",
    prenom: "",
    email: "",
    role: "",
    profileImage: "", // URL de l'image 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/admin/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // le token pour l'authentification
          },
        });
        const data = await response.json();
        setProfile(data);
        setFormData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil", error);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result, // Stocke l'image en base64 pour l'affichage
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profil</h2>
      <p>Gérez vos informations personnelles.</p>

      <div className="profile-card">
        <div className="profile-image">
          <img
            src={
              profile.profileImage ||
              "https://via.placeholder.com/150" // Image par défaut si aucune image n'est définie
            }
            alt="Profil"
          />
          {isEditing && (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-upload"
            />
          )}
        </div>

        <div className="profile-details">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Annuler
                </button>
                <button type="submit" className="save-btn">
                  Enregistrer
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-info">
                <strong>Nom :</strong> {profile.nom}
              </div>
              <div className="profile-info">
                <strong>Prénom :</strong> {profile.prenom}
              </div>
              <div className="profile-info">
                <strong>Email :</strong> {profile.email}
              </div>
              <div className="profile-info">
                <strong>Rôle :</strong> {profile.role}
              </div>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Modifier le profil
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;