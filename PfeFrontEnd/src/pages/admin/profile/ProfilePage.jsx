import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import { useAuth } from '../../../context/AuthContext';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../components/common/ErrorMessage';
import SuccessMessage from '../../../components/common/SuccessMessage';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user: authUser, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    department: '',
    securityClearanceLevel: ''
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
      const data = await userService.getProfile();
      
      setProfile(data);
      setFormData({
        username: data.username || '',
        department: data.department || '',
        securityClearanceLevel: data.securityClearanceLevel || ''
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
      
      await userService.updateProfile(formData);
      
      // Also update the user in Auth context if needed
      if (updateUser) {
        await updateUser(formData);
      }
      
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
        username: profile.username || '',
        department: profile.department || '',
        securityClearanceLevel: profile.securityClearanceLevel || ''
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
      
      {profile && !isEditing ? (
        <div className="profile-details">
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
                <span className="info-label">Département:</span>
                <span className="info-value">{profile.department || "Non spécifié"}</span>
              </div>
              
              <div className="info-group">
                <span className="info-label">Niveau d'accréditation:</span>
                <span className="info-value">{profile.securityClearanceLevel || "Non spécifié"}</span>
              </div>
              
              <div className="info-group">
                <span className="info-label">Rôle:</span>
                <span className="info-value admin-role">Administrateur</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="profile-form">
          <h3>Modifier les informations</h3>
          
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
            <label htmlFor="department">Département</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="securityClearanceLevel">Niveau d'accréditation</label>
            <select
              id="securityClearanceLevel"
              name="securityClearanceLevel"
              value={formData.securityClearanceLevel || ''}
              onChange={handleChange}
            >
              <option value="">Sélectionner un niveau</option>
              <option value="Low">Faible</option>
              <option value="Medium">Moyen</option>
              <option value="High">Élevé</option>
            </select>
          </div>
          
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
    </div>
  );
};

export default ProfilePage;