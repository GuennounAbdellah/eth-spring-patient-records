
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AddUserDialog.css";

const EditUserDialog = (props) => {
  const { isOpen, onClose, onEdit, user } = props;
  const [formData, setFormData] = useState({
    id: "",
    nom: "",
    prenom: "",
    email: "",
    specialite: "",
    numeroIdentificationProfessionnel: "",
    adressePratique: "",
    numeroTelephone: "",
    role: "",
    nomHopital: "",
    ville: "",
    profileImage: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || "",
        nom: user.nom || "",
        prenom: user.prenom || "",
        email: user.email || "",
        specialite: user.specialite || "",
        numeroIdentificationProfessionnel: user.numeroIdentificationProfessionnel || "",
        adressePratique: user.adressePratique || "",
        numeroTelephone: user.numeroTelephone || "",
        role: user.role || "",
        nomHopital: user.nomHopital || "",
        ville: user.ville || "",
        profileImage: user.profileImage || "",
      });
    }
  }, [user]);

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
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEdit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>Modifier un utilisateur</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Colonne gauche */}
            <div className="form-column">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nom">Nom</label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="prenom">Prénom</label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="specialite">Spécialité</label>
                  <input
                    type="text"
                    id="specialite"
                    name="specialite"
                    value={formData.specialite}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="numeroIdentificationProfessionnel">Numéro d'identification</label>
                  <input
                    type="text"
                    id="numeroIdentificationProfessionnel"
                    name="numeroIdentificationProfessionnel"
                    value={formData.numeroIdentificationProfessionnel}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            {/* Colonne droite */}
            <div className="form-column">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="adressePratique">Adresse de pratique</label>
                  <input
                    type="text"
                    id="adressePratique"
                    name="adressePratique"
                    value={formData.adressePratique}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numeroTelephone">Numéro de téléphone</label>
                  <input
                    type="tel"
                    id="numeroTelephone"
                    name="numeroTelephone"
                    value={formData.numeroTelephone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Rôle</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
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
                  <label htmlFor="nomHopital">Nom de l'hôpital</label>
                  <input
                    type="text"
                    id="nomHopital"
                    name="nomHopital"
                    value={formData.nomHopital}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ville">Ville</label>
                  <input
                    type="text"
                    id="ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profileImage">Photo de profil</label>
                  <input
                    type="file"
                    id="profileImage"
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
          <div className="dialog-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-btn">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditUserDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default EditUserDialog;