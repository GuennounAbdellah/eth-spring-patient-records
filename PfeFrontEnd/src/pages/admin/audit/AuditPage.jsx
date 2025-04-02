
import { useState, useEffect } from "react";
import "./AuditPage.css";

const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Recherche par utilisateur ou ID
  const [actionFilter, setActionFilter] = useState(""); // Filtre par type d'action

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/blockchain/logs");
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des logs blockchain", error);
      }
    };
    fetchLogs();
  }, []);

  // Filtrer les logs en fonction de la recherche et du filtre
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.id.toString().includes(searchTerm) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="audit-container">
      <h2>Logs Blockchain </h2>
      <p>suivre les actions enregistrées dans la blockchain.</p>

      <div className="filters">
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher par utilisateur ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="action-filter"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="">Toutes les actions</option>
          <option value="creation">Création</option>
          <option value="modification">Modification</option>
          <option value="access">Accès</option>
        </select>
      </div>

      <table className="blockchain-table">
        <thead>
          <tr>
            <th>ID Transaction</th>
            <th>Utilisateur</th>
            <th>Action</th>
            <th>Date</th>
            <th>Hash Blockchain</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user}</td>
                <td>{log.action}</td>
                <td>{new Date(log.date).toLocaleString()}</td>
                <td>{log.hash}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Aucun log trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditPage;