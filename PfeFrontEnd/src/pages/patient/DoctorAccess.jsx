import React, { useState, useEffect } from "react";
import { patientService } from "../../services/patientService";
import { userService } from "../../services/userService"; 
import LoadingIndicator from "../../components/common/LoadingIndicator";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import "./DoctorAccess.css";

const DoctorAccess = () => {
  const [authorizedDoctors, setAuthorizedDoctors] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [accessDuration, setAccessDuration] = useState(30); // Default 30 days
  const [isGrantingAccess, setIsGrantingAccess] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [doctorToRevoke, setDoctorToRevoke] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      // Get doctors with access to patient
      const myDoctors = await patientService.getAuthorizedDoctors();
      setAuthorizedDoctors(myDoctors || []);
      
      // Get all available doctors
      const allDoctors = await userService.getDoctors();
      
      // Filter out doctors that already have access
      const myDoctorIds = myDoctors.map(d => d.userId);
      const available = allDoctors.filter(d => !myDoctorIds.includes(d.id));
      
      setAvailableDoctors(available || []);
      
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Impossible de charger la liste des médecins");
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!selectedDoctor) return;
    
    setIsGrantingAccess(true);
    try {
      await patientService.grantAccess(selectedDoctor.username, accessDuration);
      
      // Refresh doctor lists
      await fetchDoctors();
      
      setSuccess(`Accès accordé au Dr. ${selectedDoctor.username} pour ${accessDuration} jours`);
      setSelectedDoctor(null);
      
      // Auto-clear success message
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error granting access:", err);
      setError(`Impossible d'accorder l'accès: ${err.message || err}`);
    } finally {
      setIsGrantingAccess(false);
    }
  };

  const confirmRevokeAccess = (doctor) => {
    setDoctorToRevoke(doctor);
    setShowConfirmDialog(true);
  };

  const handleRevokeAccess = async () => {
    if (!doctorToRevoke) return;
    
    setLoading(true);
    try {
      await patientService.removeAccess(doctorToRevoke.username);
      
      // Update UI by filtering out the revoked doctor
      setAuthorizedDoctors(authorizedDoctors.filter(d => d.userId !== doctorToRevoke.userId));
      
      // Add the doctor back to available doctors
      setAvailableDoctors([...availableDoctors, {
        id: doctorToRevoke.userId,
        username: doctorToRevoke.username,
        specialization: doctorToRevoke.specialization
      }]);
      
      setSuccess(`Accès révoqué pour le Dr. ${doctorToRevoke.username}`);
      
      // Auto-clear success message
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error revoking access:", err);
      setError(`Impossible de révoquer l'accès: ${err.message || err}`);
    } finally {
      setLoading(false);
      setShowConfirmDialog(false);
      setDoctorToRevoke(null);
    }
  };

  const filteredDoctors = searchQuery 
    ? availableDoctors.filter(doctor => 
        doctor.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (doctor.specialization && doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : availableDoctors;

  if (loading && !authorizedDoctors.length) {
    return <LoadingIndicator message="Chargement des médecins..." />;
  }

  return (
    <div className="doctor-access-container">
      <h1>Gestion des accès médecins</h1>
      
      {error && <ErrorMessage message={error} />}
      {success && <SuccessMessage message={success} />}
      
      <section className="authorized-doctors-section">
        <h2>Médecins ayant accès à mon dossier</h2>
        
        {authorizedDoctors.length > 0 ? (
          <div className="doctors-list">
            {authorizedDoctors.map((doctor) => (
              <div key={doctor.userId} className="doctor-card">
                <div className="doctor-info">
                  <h3>{doctor.username}</h3>
                  {doctor.specialization && (
                    <p className="doctor-specialization">{doctor.specialization}</p>
                  )}
                  {doctor.hospitalAffiliation && (
                    <p className="doctor-hospital">{doctor.hospitalAffiliation}</p>
                  )}
                </div>
                <button 
                  className="revoke-button" 
                  onClick={() => confirmRevokeAccess(doctor)}
                >
                  Révoquer l'accès
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-doctors">Vous n'avez pas encore autorisé de médecins à accéder à votre dossier.</p>
        )}
      </section>
      
      <section className="grant-access-section">
        <h2>Accorder l'accès à un médecin</h2>
        
        <div className="search-doctors">
          <input 
            type="text" 
            placeholder="Rechercher un médecin..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        {selectedDoctor ? (
          <div className="grant-access-form">
            <h3>Accorder l'accès au Dr. {selectedDoctor.username}</h3>
            
            {selectedDoctor.specialization && (
              <p className="doctor-specialization">{selectedDoctor.specialization}</p>
            )}
            
            <div className="form-group">
              <label htmlFor="accessDuration">Durée d'accès (jours)</label>
              <input 
                type="number" 
                id="accessDuration" 
                value={accessDuration} 
                onChange={(e) => setAccessDuration(parseInt(e.target.value))}
                min="1"
                max="365"
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="grant-button"
                onClick={handleGrantAccess}
                disabled={isGrantingAccess}
              >
                {isGrantingAccess ? "En cours..." : "Accorder l'accès"}
              </button>
              <button 
                className="cancel-button"
                onClick={() => setSelectedDoctor(null)}
                disabled={isGrantingAccess}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            {filteredDoctors.length > 0 ? (
              <div className="doctors-grid">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="doctor-card">
                    <div className="doctor-info">
                      <h3>{doctor.username}</h3>
                      {doctor.specialization && (
                        <p className="doctor-specialization">{doctor.specialization}</p>
                      )}
                    </div>
                    <button 
                      className="select-button"
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      Sélectionner
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-doctors">
                {searchQuery 
                  ? "Aucun médecin trouvé correspondant à votre recherche" 
                  : "Aucun médecin disponible pour le moment"}
              </p>
            )}
          </>
        )}
      </section>
      
      {showConfirmDialog && (
        <ConfirmDialog
          isOpen={showConfirmDialog}
          title="Confirmer la révocation"
          message={`Êtes-vous sûr de vouloir révoquer l'accès du Dr. ${doctorToRevoke?.username} à votre dossier médical?`}
          confirmLabel="Révoquer l'accès"
          cancelLabel="Annuler"
          onConfirm={handleRevokeAccess}
          onCancel={() => {
            setShowConfirmDialog(false);
            setDoctorToRevoke(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorAccess;