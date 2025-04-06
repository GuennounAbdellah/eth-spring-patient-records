import { useState, useEffect } from "react";
import { api } from "../../../services/api";
import LoadingIndicator from "../../../components/common/LoadingIndicator";
import "./AuditPage.css";

const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [timeRange, setTimeRange] = useState("all"); // "day", "week", "month", "all"

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await api.get("/blockchain/logs");
        setLogs(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching blockchain logs:", err);
        setError("Erreur lors de la récupération des logs blockchain");
        
        // Mock data for demonstration
        const mockLogs = Array(20).fill(null).map((_, i) => ({
          id: i + 1,
          action: ["CREATE", "ACCESS", "UPDATE", "DELETE"][Math.floor(Math.random() * 4)],
          user: `user${Math.floor(Math.random() * 10) + 1}`,
          timestamp: Date.now() / 1000 - Math.floor(Math.random() * 86400 * 30),
          hash: `0x${Math.random().toString(16).substring(2, 34)}`
        }));
        setLogs(mockLogs);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLogs();
  }, []);

  // Filter logs by time range
  const getTimeFilteredLogs = () => {
    if (timeRange === "all") return logs;
    
    const now = Date.now() / 1000;
    const timeFilters = {
      day: now - 86400,
      week: now - 86400 * 7,
      month: now - 86400 * 30
    };
    
    return logs.filter(log => log.timestamp >= timeFilters[timeRange]);
  };

  // Filtrer les logs en fonction de la recherche et du filtre
  const filteredLogs = getTimeFilteredLogs().filter((log) => {
    const matchesSearch =
      searchTerm === "" ||
      log.id.toString().includes(searchTerm) ||
      (log.user && log.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.hash && log.hash.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesAction = actionFilter === "" || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="audit-container">
      <h2>Journal Blockchain</h2>
      <p>Historique des transactions et opérations enregistrées dans la blockchain</p>

      <div className="filter-section">
        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par utilisateur, ID ou hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className="action-filter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="">Toutes les actions</option>
            <option value="CREATE">Création</option>
            <option value="UPDATE">Modification</option>
            <option value="ACCESS">Accès</option>
            <option value="DELETE">Suppression</option>
          </select>
        </div>
        
        <div className="time-filter">
          <button 
            className={timeRange === "day" ? "active" : ""}
            onClick={() => setTimeRange("day")}
          >
            Dernières 24h
          </button>
          <button 
            className={timeRange === "week" ? "active" : ""}
            onClick={() => setTimeRange("week")}
          >
            7 jours
          </button>
          <button 
            className={timeRange === "month" ? "active" : ""}
            onClick={() => setTimeRange("month")}
          >
            30 jours
          </button>
          <button 
            className={timeRange === "all" ? "active" : ""}
            onClick={() => setTimeRange("all")}
          >
            Tout
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingIndicator message="Chargement des logs..." />
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <div className="table-responsive">
          <table className="blockchain-table">
            <thead>
              <tr>
                <th>ID</th>
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
                    <td>{log.user || 'N/A'}</td>
                    <td>
                      <span className={`action-badge ${log.action.toLowerCase()}`}>
                        {log.action === 'CREATE' ? 'Création' :
                         log.action === 'UPDATE' ? 'Modification' :
                         log.action === 'ACCESS' ? 'Accès' :
                         log.action === 'DELETE' ? 'Suppression' : log.action}
                      </span>
                    </td>
                    <td>{new Date(log.timestamp * 1000).toLocaleString()}</td>
                    <td className="hash-cell">
                      <span className="hash-value" title={log.hash}>
                        {log.hash?.substring(0, 10)}...{log.hash?.substring(log.hash.length - 10)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">Aucun log trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuditPage;