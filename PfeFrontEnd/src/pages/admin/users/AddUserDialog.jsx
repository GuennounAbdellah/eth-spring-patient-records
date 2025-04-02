
import { useState } from "react";
import "./AddUserDialog.css";

const AddUserDialog = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    specialite: "",
    numeroIdentificationProfessionnel: "",
    adressePratique: "",
    numeroTelephone: "",
    role: "",
    nomHopital: "",
    ville: "",
    profileImage: "",
  });

  const handleChange = (e) => {
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
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      password: "",
      specialite: "",
      numeroIdentificationProfessionnel: "",
      adressePratique: "",
      numeroTelephone: "",
      role: "",
      nomHopital: "",
      ville: "",
      profileImage: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>Ajouter un utilisateur</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="form-grid">
              {/* Colonne gauche */}
              <div className="form-column">
                <div className="form-row">
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
                </div>
                <div className="form-row">
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
                    <label>Mot de passe</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Spécialité</label>
                    <input
                      type="text"
                      name="specialite"
                      value={formData.specialite}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Numéro d'identification</label>
                    <input
                      type="text"
                      name="numeroIdentificationProfessionnel"
                      value={formData.numeroIdentificationProfessionnel}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              {/* Colonne droite */}
              <div className="form-column">
                <div className="form-row">
                  <div className="form-group">
                    <label>Adresse de pratique</label>
                    <input
                      type="text"
                      name="adressePratique"
                      value={formData.adressePratique}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Numéro de téléphone</label>
                    <input
                      type="tel"
                      name="numeroTelephone"
                      value={formData.numeroTelephone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rôle</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                      <option value="doctor">Docteur</option>
                      <option value="patient">Patient</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Nom de l'hôpital</label>
                    <input
                      type="text"
                      name="nomHopital"
                      value={formData.nomHopital}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Ville</label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Photo de profil</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formData.profileImage && (
                      <img
                        src={formData.profileImage}
                        alt="Prévisualisation"
                        className="image-preview"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Boutons à l'intérieur du form-container */}
            <div className="dialog-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="submit-btn">
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserDialog;