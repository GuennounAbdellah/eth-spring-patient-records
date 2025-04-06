import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./AddUserDialog.css";

const AddUserDialog = ({ isOpen, onClose, onAdd, userType }) => {
  // Use form fields that match backend
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
  });

  const [errors, setErrors] = useState({});

  // Reset form data when user type changes
  useEffect(() => {
    setFormData({
      username: "",
      password: "",
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
    });
    setErrors({});
  }, [userType]);

  const validateForm = () => {
    const newErrors = {};
    // Common validations
    if (!formData.username) newErrors.username = "Nom d'utilisateur requis";
    if (!formData.password) newErrors.password = "Mot de passe requis";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    if (!formData.email) newErrors.email = "Email requis";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Format d'email invalide";

    // Type-specific validations
    if (userType === "doctor") {
      if (!formData.specialization) newErrors.specialization = "Spécialité requise";
      if (!formData.licenseNumber) newErrors.licenseNumber = "Numéro de licence requis";
    } else if (userType === "patient") {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date de naissance requise";
      if (!formData.medicalRecordNumber) newErrors.medicalRecordNumber = "Numéro de dossier médical requis";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Format the data to match backend expectations
    let userData = {};
    
    // Common fields for all user types
    userData = {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      fullName: formData.fullName
    };
    
    // Add type-specific fields
    if (userType === "doctor") {
      userData = {
        ...userData,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        hospitalAffiliation: formData.hospitalAffiliation
      };
    } else if (userType === "patient") {
      userData = {
        ...userData,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        medicalRecordNumber: formData.medicalRecordNumber,
        walletAddress: formData.walletAddress || null
      };
    }
    
    onAdd(userData);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>
            Ajouter un {userType === "admin" ? "administrateur" : 
                        userType === "doctor" ? "médecin" : "patient"}
          </h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            {/* Common fields for all user types */}
            <div className="form-section">
              <h4>Informations générales</h4>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">
                    Nom d'utilisateur <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={errors.username ? "error" : ""}
                  />
                  {errors.username && (
                    <span className="error-message">{errors.username}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="password">
                    Mot de passe <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? "error" : ""}
                  />
                  {errors.password && (
                    <span className="error-message">{errors.password}</span>
                  )}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    Nom complet <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={errors.fullName ? "error" : ""}
                  />
                  {errors.fullName && (
                    <span className="error-message">{errors.fullName}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Doctor-specific fields */}
            {userType === "doctor" && (
              <div className="form-section">
                <h4>Informations du médecin</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="specialization">
                      Spécialité <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className={errors.specialization ? "error" : ""}
                    />
                    {errors.specialization && (
                      <span className="error-message">{errors.specialization}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="licenseNumber">
                      Numéro de licence <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      className={errors.licenseNumber ? "error" : ""}
                    />
                    {errors.licenseNumber && (
                      <span className="error-message">{errors.licenseNumber}</span>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="hospitalAffiliation">
                    Affiliation hospitalière
                  </label>
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
            
            {/* Patient-specific fields */}
            {userType === "patient" && (
              <div className="form-section">
                <h4>Informations du patient</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="dateOfBirth">
                      Date de naissance <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={errors.dateOfBirth ? "error" : ""}
                    />
                    {errors.dateOfBirth && (
                      <span className="error-message">{errors.dateOfBirth}</span>
                    )}
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
                    <label htmlFor="medicalRecordNumber">
                      Numéro de dossier médical <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="medicalRecordNumber"
                      name="medicalRecordNumber"
                      value={formData.medicalRecordNumber}
                      onChange={handleChange}
                      className={errors.medicalRecordNumber ? "error" : ""}
                    />
                    {errors.medicalRecordNumber && (
                      <span className="error-message">{errors.medicalRecordNumber}</span>
                    )}
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddUserDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  userType: PropTypes.string.isRequired,
};

export default AddUserDialog;