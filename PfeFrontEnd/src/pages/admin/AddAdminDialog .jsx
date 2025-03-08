import { useState } from "react";
import "./AdminTable.css";
import PropTypes from "prop-types";

const AddAdminDialog = (props) => {
  const { isOpen, onClose, onAdd } = props;
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    nomHopital: "",
    role: "admin",
    ville: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      password: "",
      nomHopital: "",
      role: "",
      ville: "",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>Ajouter un administrateur</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="dialog-form">
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
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="nomHopital">Nom Hôpital</label>
            <input
              type="text"
              id="nomHopital"
              name="nomHopital"
              value={formData.nomHopital}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="ville">Ville</label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              className="choiceRoleInput"
              name="role"
              id="role"
              value={formData.profil}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="superAdmin">Super admin</option>
            </select>
          </div>

          <div className="dialog-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-btn">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
AddAdminDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AddAdminDialog;
