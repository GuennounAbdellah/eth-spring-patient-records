import React, { useState, useEffect } from "react";
import { patientService } from "../../services/patientService";
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    username: "",
    walletAddress: "",
    dateOfBirth: "",
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: ""
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
      const data = await patientService.getProfile();
      
      // Convert date string to date input format if needed
      let dateOfBirth = data.dateOfBirth;
      if (dateOfBirth && !dateOfBirth.includes('-')) {
        const date = new Date(dateOfBirth);
        dateOfBirth = date.toISOString().split('T')[0];
      }
      
      setProfile({
        ...data,
        dateOfBirth
      });
      
      setFormData({
        username: data.username || "",
        walletAddress: data.walletAddress || "",
        dateOfBirth: dateOfBirth || "",
        bloodGroup: data.bloodGroup || "",
        allergies: data.allergies || "",
        chronicConditions: data.chronicConditions || "",
        emergencyContact: data.emergencyContact || ""
      });
      
      setError(null);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Impossible de récupérer les informations du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Update only the fields from the active tab
      const updateData = {
        ...(activeTab === 'personal' ? {
          username: formData.username,
          walletAddress: formData.walletAddress
        } : {
          dateOfBirth: formData.dateOfBirth,
          bloodGroup: formData.bloodGroup,
          allergies: formData.allergies,
          chronicConditions: formData.chronicConditions,
          emergencyContact: formData.emergencyContact
        })
      };
      
      await patientService.updateProfile(updateData);
      
      // Refresh profile data
      await fetchProfile();
      
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        username: profile.username || "",
        walletAddress: profile.walletAddress || "",
        dateOfBirth: profile.dateOfBirth || "",
        bloodGroup: profile.bloodGroup || "",
        allergies: profile.allergies || "",
        chronicConditions: profile.chronicConditions || "",
        emergencyContact: profile.emergencyContact || ""
      });
    }
    setIsEditing(false);
  };

  if (loading && !profile) {
    return <LoadingIndicator message="Chargement du profil..." />;
  }

  return (
    <div className="profile-page">
      <h1>Mon Profil</h1>
      
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      
      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Informations personnelles
        </button>
        <button 
          className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
          onClick={() => setActiveTab('medical')}
        >
          Informations médicales
        </button>
      </div>
      
      {profile && !isEditing ? (
        <div className="profile-details">
          {activeTab === 'personal' ? (
            <div className="profile-card">
              <div className="profile-header">
                <h3>Informations personnelles</h3>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="edit-button"
                >
                  Modifier
                </button>
              </div>
              
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Nom d'utilisateur:</span>
                  <span className="info-value">{profile.username}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Adresse de portefeuille:</span>
                  <span className="info-value wallet-address">
                    {profile.walletAddress || "Non configurée"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-card">
              <div className="profile-header">
                <h3>Informations médicales</h3>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="edit-button"
                >
                  Modifier
                </button>
              </div>
              
              <div className="profile-info">
                <div className="info-group">
                  <span className="info-label">Date de naissance:</span>
                  <span className="info-value">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('fr-FR') : "Non renseignée"}
                  </span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Groupe sanguin:</span>
                  <span className="info-value">{profile.bloodGroup || "Non renseigné"}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Allergies:</span>
                  <span className="info-value">{profile.allergies || "Aucune allergie connue"}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Maladies chroniques:</span>
                  <span className="info-value">{profile.chronicConditions || "Aucune maladie chronique connue"}</span>
                </div>
                
                <div className="info-group">
                  <span className="info-label">Contact d'urgence:</span>
                  <span className="info-value">{profile.emergencyContact || "Non renseigné"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <h3>Modifier {activeTab === 'personal' ? 'les informations personnelles' : 'les informations médicales'}</h3>
          
          {activeTab === 'personal' ? (
            <>
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="walletAddress">Adresse de portefeuille</label>
                <input
                  type="text"
                  id="walletAddress"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="0x..."
                />
                <p className="field-help">Adresse Ethereum pour les interactions blockchain</p>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Date de naissance</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth ? formData.dateOfBirth.substring(0, 10) : ""}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bloodGroup">Groupe sanguin</label>
                <select
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup || ""}
                  onChange={handleChange}
                >
                  <option value="">-- Sélectionner --</option>
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
              
              <div className="form-group">
                <label htmlFor="allergies">Allergies</label>
                <textarea
                  id="allergies"
                  name="allergies"
                  value={formData.allergies || ""}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Listez vos allergies (médicaments, aliments, etc.)"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="chronicConditions">Maladies chroniques</label>
                <textarea
                  id="chronicConditions"
                  name="chronicConditions"
                  value={formData.chronicConditions || ""}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Listez vos maladies chroniques"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="emergencyContact">Contact d'urgence</label>
                <input
                  type="text"
                  id="emergencyContact"
                  name="emergencyContact"
                  value={formData.emergencyContact || ""}
                  onChange={handleChange}
                  placeholder="Nom et numéro de téléphone"
                />
              </div>
            </>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn-cancel"
              disabled={loading}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
      
      <div className="password-section">
        <h3>Sécurité</h3>
        <button 
          onClick={() => window.location.href = '/patient/change-password'} 
          className="btn-secondary"
        >
          Changer le mot de passe
        </button>
      </div>
    </div>
  );
};

export default Profile;