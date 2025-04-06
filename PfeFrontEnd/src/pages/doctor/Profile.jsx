import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialization: "",
    licenseNumber: "",
    hospitalAffiliation: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Password change states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileService.getProfile();
        
        setProfile(profileData);
        setFormData({
          fullName: profileData.fullName || "",
          email: profileData.email || "",
          specialization: profileData.specialization || "",
          licenseNumber: profileData.licenseNumber || "",
          hospitalAffiliation: profileData.hospitalAffiliation || "",
        });
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement du profil");
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: profile.fullName || "",
      email: profile.email || "",
      specialization: profile.specialization || "",
      licenseNumber: profile.licenseNumber || "",
      hospitalAffiliation: profile.hospitalAffiliation || "",
    });
    setIsEditing(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    // Clear password error when user types
    if (passwordError) {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updatedProfile = await profileService.updateProfile(formData);
      
      setProfile(updatedProfile);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setLoading(true);
      await profileService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordSuccess("Mot de passe modifié avec succès");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // Clear success message and close form after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(null);
        setShowPasswordForm(false);
      }, 3000);
    } catch (err) {
      setPasswordError("Erreur lors du changement de mot de passe");
      console.error("Error changing password:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile) {
    return <div className="loading-container">Chargement du profil...</div>;
  }

  return (
    <div className="profile-container">
      <h1>Mon Profil</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-card">
        <div className="profile-header">
          <h2>Informations personnelles</h2>
          {!isEditing && (
            <button onClick={handleEditClick} className="edit-button">
              Modifier
            </button>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="fullName">Nom complet</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
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
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="specialization">Spécialité</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="licenseNumber">Numéro de licence</label>
              <input
                type="text"
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="hospitalAffiliation">Affiliation hospitalière</label>
              <input
                type="text"
                id="hospitalAffiliation"
                name="hospitalAffiliation"
                value={formData.hospitalAffiliation}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-actions">
              <button type="button" onClick={handleCancelEdit} className="cancel-button">
                Annuler
              </button>
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            {profile ? (
              <>
                <div className="detail-row">
                  <span className="detail-label">Nom:</span>
                  <span className="detail-value">{profile.fullName || "Non renseigné"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{profile.email || "Non renseigné"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Spécialité:</span>
                  <span className="detail-value">{profile.specialization || "Non renseigné"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Numéro de licence:</span>
                  <span className="detail-value">{profile.licenseNumber || "Non renseigné"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Affiliation hospitalière:</span>
                  <span className="detail-value">{profile.hospitalAffiliation || "Non renseigné"}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Identifiant:</span>
                  <span className="detail-value">{profile.username || "Non renseigné"}</span>
                </div>
              </>
            ) : (
              <div className="placeholder">Informations du profil non disponibles.</div>
            )}
          </div>
        )}
      </div>
      
      <div className="security-section">
        <h2>Sécurité</h2>
        <button onClick={togglePasswordForm} className="password-button">
          {showPasswordForm ? "Annuler" : "Changer le mot de passe"}
        </button>
        
        {showPasswordForm && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            {passwordError && <div className="error-message">{passwordError}</div>}
            {passwordSuccess && <div className="success-message">{passwordSuccess}</div>}
            
            <div className="form-group">
              <label htmlFor="currentPassword">Mot de passe actuel</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">Nouveau mot de passe</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                required
              />
            </div>
            
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;