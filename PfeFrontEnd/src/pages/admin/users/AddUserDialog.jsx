import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AddUserDialog.css';

const AddUserDialog = ({ isOpen, onClose, onAdd, userType }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    walletAddress: '',
    // Doctor fields
    licenseNumber: '',
    specialization: '',
    hospitalAffiliation: '',
    // Patient fields
    dateOfBirth: '',
    bloodGroup: '',
    medicalRecordNumber: '',
  });

  const [errors, setErrors] = useState({});

  // Reset form when dialog opens or userType changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: '',
        password: '',
        email: '',
        walletAddress: '',
        licenseNumber: '',
        specialization: '',
        hospitalAffiliation: '',
        dateOfBirth: '',
        bloodGroup: '',
        medicalRecordNumber: '',
      });
      setErrors({});
    }
  }, [isOpen, userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.username) {
      newErrors.username = "Le nom d'utilisateur est requis";
    }

    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Wallet address validation (optional field)
    if (formData.walletAddress && !/^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress)) {
      newErrors.walletAddress = "Format d'adresse Ethereum invalide";
    }

    // Doctor-specific validation
    if (userType === "doctor") {
      if (!formData.licenseNumber) {
        newErrors.licenseNumber = "Le numéro de licence est requis";
      }
      if (!formData.specialization) {
        newErrors.specialization = "La spécialisation est requise";
      }
    }

    // Patient-specific validation
    if (userType === "patient") {
      if (!formData.medicalRecordNumber) {
        newErrors.medicalRecordNumber = "Le numéro de dossier médical est requis";
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "La date de naissance est requise";
      }
    }

    return newErrors;
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
      walletAddress: formData.walletAddress || "",
      role: userType.toUpperCase() // Convert to PATIENT, DOCTOR, ADMIN format
    };
    
    // Add type-specific fields
    if (userType === "doctor") {
      userData = {
        ...userData,
        licenseNumber: formData.licenseNumber,
        specialization: formData.specialization,
        hospitalAffiliation: formData.hospitalAffiliation || "",
      };
    } else if (userType === "patient") {
      userData = {
        ...userData,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup || "",
        medicalRecordNumber: formData.medicalRecordNumber,
      };
    }
    
    onAdd(userData);
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>
            {userType === "patient" && "Ajouter un patient"}
            {userType === "doctor" && "Ajouter un médecin"}
            {userType === "admin" && "Ajouter un administrateur"}
          </h2>
          <button className="close-dialog-btn" onClick={onClose}>×</button>
        </div>

        <form className="dialog-form" onSubmit={handleSubmit}>
          {/* Common fields for all user types */}
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur*</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <div className="field-error">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="email">Email*</label>
            <input
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="walletAddress">Adresse Ethereum (Optionnel)</label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              placeholder="0x..."
            />
            {errors.walletAddress && <div className="field-error">{errors.walletAddress}</div>}
            <div className="field-help">Format: 0x suivi de 40 caractères hexadécimaux</div>
          </div>

          {/* Doctor-specific fields */}
          {userType === "doctor" && (
            <>
              <div className="form-group">
                <label htmlFor="licenseNumber">Numéro de licence*</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                />
                {errors.licenseNumber && <div className="field-error">{errors.licenseNumber}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="specialization">Spécialisation*</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
                {errors.specialization && <div className="field-error">{errors.specialization}</div>}
              </div>

              <div className="form-group form-group-full">
                <label htmlFor="hospitalAffiliation">Affiliation hospitalière</label>
                <input
                  type="text"
                  id="hospitalAffiliation"
                  name="hospitalAffiliation"
                  value={formData.hospitalAffiliation}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Patient-specific fields */}
          {userType === "patient" && (
            <>
              <div className="form-group">
                <label htmlFor="medicalRecordNumber">Numéro de dossier médical*</label>
                <input
                  type="text"
                  id="medicalRecordNumber"
                  name="medicalRecordNumber"
                  value={formData.medicalRecordNumber}
                  onChange={handleChange}
                />
                {errors.medicalRecordNumber && (
                  <div className="field-error">{errors.medicalRecordNumber}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="dateOfBirth">Date de naissance*</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
                {errors.dateOfBirth && <div className="field-error">{errors.dateOfBirth}</div>}
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
            </>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
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
  userType: PropTypes.oneOf(['patient', 'doctor', 'admin']).isRequired,
};

export default AddUserDialog;