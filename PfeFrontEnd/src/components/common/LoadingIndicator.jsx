import "./LoadingIndicator.css";

const LoadingIndicator = ({ message = "Chargement..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  );
};

export default LoadingIndicator;