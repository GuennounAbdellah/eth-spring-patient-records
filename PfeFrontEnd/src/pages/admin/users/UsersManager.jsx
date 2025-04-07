import React, { useState, useEffect } from 'react';
import UserTable from './UserTable';
import AddUserDialog from './AddUserDialog';
import { adminService } from '../../../services/adminService';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './UsersManager.css';

const UsersManager = () => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [userType, setUserType] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllUsers();
      setUsers(response || []);
    } catch (err) {
      setError(`Erreur lors de la récupération des utilisateurs: ${err.message || 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddUserDialog = (type) => {
    setUserType(type);
    setIsAddUserDialogOpen(true);
  };

  const handleCloseAddUserDialog = () => {
    setIsAddUserDialogOpen(false);
  };

  const handleAddUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      // Use the appropriate registration method based on user type
      if (userType === 'doctor') {
        response = await adminService.registerDoctor(userData);
      } else if (userType === 'patient') {
        response = await adminService.registerPatient(userData);
      } else {
        response = await adminService.registerAdmin(userData);
      }

      setSuccess(`Utilisateur ${userData.username} ajouté avec succès`);
      handleCloseAddUserDialog();
      fetchUsers(); // Refresh the user list
    } catch (err) {
      console.error('Error adding user:', err);
      setError(`Erreur lors de l'ajout de l'utilisateur: ${
        err.response?.data?.details || 
        err.response?.data?.error || 
        err.message || 
        'Erreur inconnue'
      }`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-manager-container">
      <div className="users-header">
        <h1>Gestion des Utilisateurs</h1>
        <div className="add-user-buttons">
          <button 
            className="add-btn patient"
            onClick={() => handleOpenAddUserDialog('patient')}
          >
            Ajouter un patient
          </button>
          <button 
            className="add-btn doctor"
            onClick={() => handleOpenAddUserDialog('doctor')}
          >
            Ajouter un médecin
          </button>
          <button 
            className="add-btn admin"
            onClick={() => handleOpenAddUserDialog('admin')}
          >
            Ajouter un administrateur
          </button>
        </div>
      </div>

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

      {loading && <LoadingIndicator />}

      <UserTable 
        users={users} 
        onStatusChange={fetchUsers}
      />

      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onClose={handleCloseAddUserDialog}
        onAdd={handleAddUser}
        userType={userType}
      />
    </div>
  );
};

export default UsersManager;