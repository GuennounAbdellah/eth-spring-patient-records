// src/components/patient/BlockchainHistory.jsx
const BlockchainHistory = ({ history }) => {
    return (
      <div className="blockchain-history">
        <h3>Historique des modifications (Blockchain)</h3>
        {history?.length > 0 ? (
          <table className="blockchain-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Utilisateur</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.date}</td>
                  <td>{entry.action}</td>
                  <td>{entry.user}</td>
                  <td>{entry.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="placeholder">Aucune modification enregistrée.</div>
        )}
      </div>
    );
  };
  
  export default BlockchainHistory;