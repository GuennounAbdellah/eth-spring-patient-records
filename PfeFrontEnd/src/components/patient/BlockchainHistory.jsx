import React from "react";
import PropTypes from "prop-types";
import "./BlockchainHistory.css";

const BlockchainHistory = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div className="blockchain-history">
        <div className="no-history">
          Aucune transaction blockchain trouvée pour votre dossier médical.
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "Date inconnue";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const shortenAddress = (address) => {
    if (!address) return "Adresse inconnue";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="blockchain-history">
      <div className="history-list">
        {history.map((transaction, index) => (
          <div key={transaction.hash || index} className="transaction-item">
            <div className="transaction-header">
              <div className="transaction-type">
                {transaction.action || "Mise à jour du dossier"}
              </div>
              <div className="transaction-date">{formatDate(transaction.timestamp)}</div>
            </div>
            <div className="transaction-details">
              <div className="detail-row">
                <span className="detail-label">Transaction:</span>
                <span className="detail-value">
                  <a
                    href={`https://etherscan.io/tx/${transaction.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transaction-link"
                  >
                    {shortenAddress(transaction.hash)}
                  </a>
                </span>
              </div>
              {transaction.from && (
                <div className="detail-row">
                  <span className="detail-label">De:</span>
                  <span className="detail-value">
                    {shortenAddress(transaction.from)}
                  </span>
                </div>
              )}
              {transaction.to && (
                <div className="detail-row">
                  <span className="detail-label">À:</span>
                  <span className="detail-value">
                    {shortenAddress(transaction.to)}
                  </span>
                </div>
              )}
              {transaction.status && (
                <div className="detail-row">
                  <span className="detail-label">Statut:</span>
                  <span className={`detail-value status-${transaction.status}`}>
                    {transaction.status === "success" ? "Réussie" : "Échouée"}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

BlockchainHistory.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      timestamp: PropTypes.number,
      from: PropTypes.string,
      to: PropTypes.string,
      action: PropTypes.string,
      status: PropTypes.string,
    })
  ),
};

export default BlockchainHistory;