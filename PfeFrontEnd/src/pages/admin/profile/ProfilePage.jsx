import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    walletAddress: "",
    department: "",
    securityClearanceLevel: "",
    emergencyAccessGrantor: false
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
        department: response.department || "",
        securityClearanceLevel: response.securityClearanceLevel || "",
        emergencyAccessGrantor: response.emergencyAccessGrantor || false
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
        department: formData.department,
        securityClearanceLevel: formData.securityClearanceLevel,
        emergencyAccessGrantor: formData.emergencyAccessGrantor
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
      department: profile.department || "",
      securityClearanceLevel: profile.securityClearanceLevel || "",
      emergencyAccessGrantor: profile.emergencyAccessGrantor || false
    });
    setIsEditing(false);
  };

  if (loading && !profile) {
    return <LoadingIndicator />;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profil Administrateur</h1>
      
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
          className={`tab-button ${activeTab === "admin" ? "active" : ""}`}
          onClick={() => setActiveTab("admin")}
        >
          Administration
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
                  <label htmlFor="department">Département</label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Admin Information Tab */}
          {activeTab === "admin" && (
            <div className="profile-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="securityClearanceLevel">Niveau d'autorisation</label>
                  <select
                    id="securityClearanceLevel"
                    name="securityClearanceLevel"
                    value={formData.securityClearanceLevel}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={!isEditing ? "read-only" : ""}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Low">Bas</option>
                    <option value="Medium">Moyen</option>
                    <option value="High">Élevé</option>
                    <option value="SuperAdmin">Super Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group checkbox-group">
                <label htmlFor="emergencyAccessGrantor" className="checkbox-label">
                  <input
                    type="checkbox"
                    id="emergencyAccessGrantor"
                    name="emergencyAccessGrantor"
                    checked={formData.emergencyAccessGrantor}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <span>Autorisation d'accès d'urgence</span>
                </label>
                <small className="field-note">
                  Permet d'accorder l'accès aux dossiers médicaux en cas d'urgence
                </small>
              </div>
              
              <div className="admin-permissions">
                <h3>Droits d'administration</h3>
                <ul className="permissions-list">
                  <li className="permission-item">
                    <span className="permission-name">Gestion des utilisateurs</span>
                    <span className="permission-status granted">Accordé</span>
                  </li>
                  <li className="permission-item">
                    <span className="permission-name">Audit blockchain</span>
                    <span className="permission-status granted">Accordé</span>
                  </li>
                  <li className="permission-item">
                    <span className="permission-name">Mode d'urgence</span>
                    <span className={`permission-status ${formData.emergencyAccessGrantor ? 'granted' : 'denied'}`}>
                      {formData.emergencyAccessGrantor ? 'Accordé' : 'Non accordé'}
                    </span>
                  </li>
                </ul>
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
                  En tant qu'administrateur, votre adresse blockchain vous donne accès
                  au suivi des activités sur la blockchain et à la gestion des permissions.
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
                      fonctionnalités d'administration blockchain, veuillez en ajouter une.
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

export default ProfilePage;