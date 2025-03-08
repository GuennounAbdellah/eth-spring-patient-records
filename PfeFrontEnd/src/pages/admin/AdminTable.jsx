import { useState, useEffect } from "react";
import "./AdminTable.css";
import "../../components/layout/NavBar.css"
import AddAdminDialog from "./AddAdminDialog ";

const url = "http://localhost:8080/api/admins";

const AdminTable = () => {
  const [admins, setAdmins] = useState([]);
  const[ isOpen,setisOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCancel = ()=>{
    setisOpen(false)
}

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setTimeout(async () => {
        const response = await fetch(url);
        const data = await response.json();
        setAdmins(data.content);
        setIsLoading(false);
      }, 1000);
    } catch {
      setError("Erreur lors du chargement des données");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${url}/${id}`, { method: "DELETE" });
      setAdmins(admins.filter((admin) => admin.id !== id));
      handleCancel()
    } catch {
      setError("Erreur lors de la suppression");
      setIsLoading(false);
    }
  };

  const handleAdd = async (newAdmin) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin),
      });

      if (response.ok) {
        fetchAdmins();
        setIsDialogOpen(false);
      } else {
        throw new Error("Erreur lors de l'ajout");
      }
    } catch {
      setError("Erreur lors de l'ajout");
      setIsLoading(false);
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="table-container">
      <div className="header">
        <h2>Liste des Administrateurs</h2>
        <button className="add-btn" onClick={() => setIsDialogOpen(true)}>
          Ajouter un administrateur
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Nom Hôpital</th>
              <th>Role</th>
              <th>Ville</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.nom}</td>
                <td>{admin.prenom}</td>
                <td>{admin.email}</td>
                <td>{admin.nomHopital}</td>
                <td>{admin.role}</td>
                <td>{admin.ville}</td>
                <td>
                  <button onClick={() => setisOpen(true)}
                    className="delete-btn"
                  >
                    Supprimer
                  </button>
                  {isOpen && (
                    <div className="dialog-overlay">
                      <div className="dialog">
                        <h2 className="dialog-title">
                          Confirmation de suppression
                        </h2>
                        <p className="dialog-message">
                          Êtes-vous sûr de vouloir Supprimer l&apos;admin {admin.nom} ?
                        </p>
                        <div className="dialog-buttons">
                            <button
                              className="confirm-button"
                              onClick={() => handleDelete(admin.id)}
                            >
                              Confirmer
                            </button>
                          <button
                            className="cancel-button"
                            onClick={handleCancel}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <AddAdminDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
};

export default AdminTable;
