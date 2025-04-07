import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    walletAddress: "",
    licenseNumber: "",
    specialization: "",
    hospitalAffiliation: "",
    professionalBio: "",
    officeHours: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/profile');
      setProfile(response);
      
      setFormData({
        username: response.username || "",
        email: response.email || "",
        walletAddress: response.walletAddress || "",
        licenseNumber: response.licenseNumber || "",
        specialization: response.specialization || "",
        hospitalAffiliation: response.hospitalAffiliation || "",
        professionalBio: response.professionalBio || "",
        officeHours: response.officeHours || ""
      });
      
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement du profil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data for update - only send fields that can be updated
      const updateData = {
        email: formData.email,
        walletAddress: formData.walletAddress,
        specialization: formData.specialization,
        hospitalAffiliation: formData.hospitalAffiliation,
        professionalBio: formData.professionalBio,
        officeHours: formData.officeHours
      };
      
      await api.put('/api/profile/update', updateData);
      
      setSuccess("Profil mis à jour avec succès");
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile values
    setFormData({
      username: profile.username || "",
      email: profile.email || "",
      walletAddress: profile.walletAddress || "",
      licenseNumber: profile.licenseNumber || "",
      specialization: profile.specialization || "",
      hospitalAffiliation: profile.hospitalAffiliation || "",
      professionalBio: profile.professionalBio || "",
      officeHours: profile.officeHours || ""
    });
    setIsEditing(false);
  };

  if (loading && !profile) {
    return <LoadingIndicator />;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mon Profil</h1>
      
      {error && (
        <div className="message-container">
          <ErrorMessage message={error} onClose={() => setError(null)} />
        </div>
      )}
      
      {success && (
        <div className="message-container">
          <div className="success-message">
            {success}
            <button className="close-btn" onClick={() => setSuccess(null)}>×</button>
          </div>
        </div>
      )}
      
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Informations personnelles
        </button>
        <button 
          className={`tab-button ${activeTab === "professional" ? "active" : ""}`}
          onClick={() => setActiveTab("professional")}
        >
          Informations professionnelles
        </button>
        <button 
          className={`tab-button ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          Sécurité & Blockchain
        </button>
      </div>
      
      <div className="profile-content">
        <form onSubmit={handleSubmit}>
          
          {/* Personal Information Tab */}
          {activeTab === "personal" && (
            <div className="profile-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username">Nom d'utilisateur</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    disabled={true}
                    className="read-only"
                  />
                  <small className="field-note">Le nom d'utilisateur ne peut pas être modifié</small>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Professional Information Tab */}
          {activeTab === "professional" && (
            <div className="profile-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="licenseNumber">Numéro de licence</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    disabled={true}
                    className="read-only"
                  />
                  <small className="field-note">Le numéro de licence ne peut pas être modifié</small>
                </div>
                <div className="form-group">
                  <label htmlFor="specialization">Spécialisation</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
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
                  disabled={!isEditing}
                  className={!isEditing ? "read-only" : ""}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="officeHours">Horaires de consultation</label>
                <textarea
                  id="officeHours"
                  name="officeHours"
                  value={formData.officeHours}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "read-only" : ""}
                  placeholder="Ex: Lundi-Vendredi: 9h-17h"
                  rows="2"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="professionalBio">Biographie professionnelle</label>
                <textarea
                  id="professionalBio"
                  name="professionalBio"
                  value={formData.professionalBio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "read-only" : ""}
                  placeholder="Décrivez votre parcours et votre expertise"
                  rows="4"
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Blockchain/Security Tab */}
          {activeTab === "security" && (
            <div className="profile-section">
              <div className="form-group">
                <label htmlFor="walletAddress">Adresse de portefeuille Ethereum</label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "read-only" : ""}
                  placeholder="0x..."
                />
                <small className="field-note">
                  Cette adresse est utilisée pour vérifier votre identité sur la blockchain.
                  Assurez-vous qu'elle est correcte.
                </small>
              </div>
              
              <div className="blockchain-info">
                <h3>Informations blockchain</h3>
                <p>
                  En tant que médecin, votre adresse blockchain vous permet d'accéder
                  aux dossiers médicaux des patients qui vous ont accordé l'autorisation.
                </p>
                <div className="info-box">
                  <p>
                    <strong>État de la connexion blockchain:</strong>{" "}
                    {formData.walletAddress ? (
                      <span className="status-active">Active</span>
                    ) : (
                      <span className="status-inactive">Inactive</span>
                    )}
                  </p>
                  {!formData.walletAddress && (
                    <p className="warning-message">
                      Vous n'avez pas configuré d'adresse Ethereum. Pour accéder aux
                      fonctionnalités blockchain, veuillez en ajouter une.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="profile-actions">
            {!isEditing ? (
              <button 
                type="button" 
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Modifier le profil
              </button>
            ) : (
              <>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? "Sauvegarde..." : "Sauvegarder les modifications"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;