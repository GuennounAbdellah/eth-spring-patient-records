import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./EditUserDialog.css"; // Use own CSS instead of AddUserDialog.css

const EditUserDialog = ({ isOpen, onClose, onEdit, user, userType }) => {
  // Use form fields that match backend
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    fullName: "",
    email: "",
    // Doctor specific
    specialization: "",
    licenseNumber: "",
    hospitalAffiliation: "",
    // Patient specific
    dateOfBirth: "",
    bloodGroup: "",
    medicalRecordNumber: "",
    walletAddress: "",
    // Account status
    active: true
  });

  useEffect(() => {
    if (user) {
      // Set common fields
      setFormData({
        id: user.id || "",
        username: user.username || "",
        fullName: user.fullName || "",
        email: user.email || "",
        // Doctor fields
        specialization: user.specialization || "",
        licenseNumber: user.licenseNumber || "",
        hospitalAffiliation: user.hospitalAffiliation || "",
        // Patient fields
        dateOfBirth: user.dateOfBirth || "",
        bloodGroup: user.bloodGroup || "",
        medicalRecordNumber: user.medicalRecordNumber || "",
        walletAddress: user.walletAddress || "",
        // Status
        active: user.active !== undefined ? user.active : true
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
          <h3>Modifier {userType === "admin" ? "un administrateur" : 
                        userType === "doctor" ? "un médecin" : "un patient"}</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Common fields for all users */}
            <div className="form-section">
              <h4>Informations générales</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Nom d'utilisateur</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled // Username shouldn't be editable
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fullName">Nom complet</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="active">Statut du compte</label>
                  <div className="toggle-container">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        name="active"
                        checked={formData.active}
                        onChange={handleChange}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">
                      {formData.active ? "Actif" : "Inactif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Doctor specific fields */}
            {userType === "doctor" && (
              <div className="form-section">
                <h4>Informations du médecin</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="specialization">Spécialité</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="licenseNumber">Numéro de licence</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="hospitalAffiliation">Affiliation hospitalière</label>
                  <input
                    type="text"
                    id="hospitalAffiliation"
                    name="hospitalAffiliation"
                    value={formData.hospitalAffiliation}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            {/* Patient specific fields */}
            {userType === "patient" && (
              <div className="form-section">
                <h4>Informations du patient</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">Date de naissance</label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bloodGroup">Groupe sanguin</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionner</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="medicalRecordNumber">Numéro de dossier médical</label>
                    <input
                      type="text"
                      id="medicalRecordNumber"
                      name="medicalRecordNumber"
                      value={formData.medicalRecordNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="walletAddress">Adresse wallet (optionnel)</label>
                    <input
                      type="text"
                      id="walletAddress"
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      placeholder="0x..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="dialog-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-btn">
              Enregistrer
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
  userType: PropTypes.string.isRequired,
};

export default EditUserDialog;