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
    dateOfBirth: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    medicalRecordNumber: ""
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
      
      // Format date of birth for input field if it exists
      const formattedDob = response.dateOfBirth 
        ? new Date(response.dateOfBirth).toISOString().split('T')[0] 
        : '';
      
      setFormData({
        username: response.username || "",
        email: response.email || "",
        walletAddress: response.walletAddress || "",
        dateOfBirth: formattedDob,
        bloodGroup: response.bloodGroup || "",
        allergies: response.allergies || "",
        chronicConditions: response.chronicConditions || "",
        emergencyContact: response.emergencyContact || "",
        medicalRecordNumber: response.medicalRecordNumber || ""
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
        walletAddress: formData.walletAddress,
        dateOfBirth: formData.dateOfBirth || null,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
        chronicConditions: formData.chronicConditions,
        emergencyContact: formData.emergencyContact,
        email: formData.email
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
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : "",
      bloodGroup: profile.bloodGroup || "",
      allergies: profile.allergies || "",
      chronicConditions: profile.chronicConditions || "",
      emergencyContact: profile.emergencyContact || "",
      medicalRecordNumber: profile.medicalRecordNumber || ""
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
          className={`tab-button ${activeTab === "medical" ? "active" : ""}`}
          onClick={() => setActiveTab("medical")}
        >
          Informations médicales
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
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date de naissance</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="emergencyContact">Contact d'urgence</label>
                  <input
                    type="text"
                    id="emergencyContact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
                    placeholder="Nom et téléphone"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Medical Information Tab */}
          {activeTab === "medical" && (
            <div className="profile-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="medicalRecordNumber">Numéro de dossier médical</label>
                  <input
                    type="text"
                    id="medicalRecordNumber"
                    name="medicalRecordNumber"
                    value={formData.medicalRecordNumber}
                    disabled={true}
                    className="read-only"
                  />
                  <small className="field-note">Ce numéro est attribué par le système</small>
                </div>
                <div className="form-group">
                  <label htmlFor="bloodGroup">Groupe sanguin</label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
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
              
              <div className="form-group">
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "read-only" : ""}
                  placeholder="Listez vos allergies connues"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="chronicConditions">Conditions médicales chroniques</label>
                <textarea
                  id="chronicConditions"
                  name="chronicConditions"
                  value={formData.chronicConditions}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "read-only" : ""}
                  placeholder="Listez vos conditions médicales chroniques"
                  rows="3"
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
                  Vos données médicales sont sécurisées par la technologie blockchain.
                  L'adresse ci-dessus est utilisée pour contrôler l'accès à vos données.
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
                      Vous n'avez pas configuré d'adresse Ethereum. Pour une
                      sécurité optimale, veuillez en ajouter une.
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