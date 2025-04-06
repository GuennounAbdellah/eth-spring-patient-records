import React from "react";
import PropTypes from "prop-types";
import "./BlockchainTransactions.css";

const BlockchainTransactions = ({ transactions = [] }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="blockchain-empty">
        <p>Aucune transaction blockchain disponible</p>
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
      minute: "2-digit",
    });
  };

  const shortenAddress = (address) => {
    if (!address) return "Adresse inconnue";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="blockchain-transactions">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Hash</th>
            <th>Date</th>
            <th>Action</th>
            <th>De</th>
            <th>À</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={tx.hash || index}>
              <td className="tx-hash">{shortenAddress(tx.hash)}</td>
              <td>{formatDate(tx.timestamp)}</td>
              <td>{tx.action}</td>
              <td className="tx-address">{shortenAddress(tx.from)}</td>
              <td className="tx-address">{shortenAddress(tx.to)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

BlockchainTransactions.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      hash: PropTypes.string,
      timestamp: PropTypes.number,
      action: PropTypes.string,
      from: PropTypes.string,
      to: PropTypes.string
    })
  ),
};

export default BlockchainTransactions;