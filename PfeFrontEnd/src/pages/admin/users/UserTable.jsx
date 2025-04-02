
import { useState, useEffect } from "react";
import AddUserDialog from "./AddUserDialog";
import EditUserDialog from "./EditUserDialog";
import "./UserTable.css";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Page actuelle (commence à 0)
  const [totalPages, setTotalPages] = useState(0); // Nombre total de pages
  const usersPerPage = 10; // Nombre d'utilisateurs par page

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Ajouter les paramètres de pagination à la requête
        const response = await fetch(
          `http://localhost:8080/api/users?page=${currentPage}&size=${usersPerPage}`
        );
        const data = await response.json();
        setUsers(data.content); // Liste des utilisateurs pour la page actuelle
        setTotalPages(data.totalPages); // Nombre total de pages
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
      }
    };
    fetchUsers();
  }, [currentPage]); // Recharger les utilisateurs lorsque la page change

  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const addedUser = await response.json();
      setUsers([...users, addedUser]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur", error);
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      const editedUser = await response.json();
      setUsers(users.map((user) => (user.id === editedUser.id ? editedUser : user)));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur", error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="table-container">
      <div className="header">
        <h2>Gestion des utilisateurs</h2>
        <button className="add-btn" onClick={() => setIsAddDialogOpen(true)}>
          Ajouter un utilisateur
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par nom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tous les rôles</option>
          <option value="admin">Admin</option>
          <option value="superAdmin">Super Admin</option>
          <option value="doctor">Docteur</option>
          <option value="patient">Patient</option>
        </select>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Modifier
                </button>
                <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ajout des boutons de pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-btn"
        >
          Précédent
        </button>
        <span>
          Page {currentPage + 1} sur {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-btn"
        >
          Suivant
        </button>
      </div>

      <AddUserDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={handleAddUser}
      />
      <EditUserDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onEdit={handleEditUser}
        user={selectedUser}
      />
    </div>
  );
};

export default UserTable;