import React, { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import LoadingIndicator from '../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../components/common/ErrorMessage';
import './UserTable.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Using getAllUsers instead of getUsers for clarity
      const data = await userService.getAllUsers();
      setUsers(data || []);
      setFilteredUsers(data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(`Failed to fetch users: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Apply filtering when search term, role filter, or status filter changes
  useEffect(() => {
    if (!users.length) return;

    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(search) ||
        (user.fullName && user.fullName.toLowerCase().includes(search))
      );
    }

    // Apply role filter
    if (roleFilter !== 'ALL') {
      result = result.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      const isActive = statusFilter === 'ACTIVE';
      result = result.filter(user => user.active === isActive);
    }

    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const handleStatusChange = async (userId, newStatus) => {
    try {
      setLoading(true);
      await userService.updateUserStatus(userId, newStatus);
      
      // Update local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, active: newStatus } : user
      ));
      
      // Success message could be shown here
    } catch (err) {
      setError(`Failed to update user status: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !users.length) {
    return <LoadingIndicator message="Chargement des utilisateurs..." />;
  }

  return (
    <div className="user-manager-container">
      <h2>Gestion des Utilisateurs</h2>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="filter-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Tous les rôles</option>
            <option value="PATIENT">Patients</option>
            <option value="DOCTOR">Médecins</option>
            <option value="ADMIN">Administrateurs</option>
          </select>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
          </select>
        </div>
      </div>
      
      {filteredUsers.length > 0 ? (
        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nom d'utilisateur</th>
                <th>Rôle</th>
                <th>Adresse Wallet</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className={!user.active ? 'inactive-user' : ''}>
                  <td>{user.username}</td>
                  <td>{formatRole(user.role)}</td>
                  <td className="wallet-address">
                    {user.walletAddress 
                      ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}`
                      : 'Non définie'}
                  </td>
                  <td>
                    <span className={`status-badge ${user.active ? 'active' : 'inactive'}`}>
                      {user.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleStatusChange(user.id, !user.active)}
                        className={user.active ? 'deactivate-btn' : 'activate-btn'}
                      >
                        {user.active ? 'Désactiver' : 'Activer'}
                      </button>
                      <button 
                        onClick={() => {/* View details functionality */}}
                        className="view-btn"
                      >
                        Détails
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-users-found">
          {searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL'
            ? 'Aucun utilisateur ne correspond aux critères de recherche.'
            : 'Aucun utilisateur trouvé dans le système.'}
        </div>
      )}
    </div>
  );
};

// Helper function to format role for display
const formatRole = (role) => {
  switch (role) {
    case 'PATIENT': return 'Patient';
    case 'DOCTOR': return 'Médecin';
    case 'ADMIN': return 'Administrateur';
    default: return role;
  }
};

export default UserTable;