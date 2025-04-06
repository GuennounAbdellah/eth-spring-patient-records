import { useState } from "react";
import PropTypes from "prop-types";
import "./AccessForm.css";

const AccessForm = ({ doctor, onCancel, onSubmit }) => {
  const [duration, setDuration] = useState("30");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(parseInt(duration));
  };

  return (
    <div className="access-form-overlay">
      <div className="access-form-container">
        <h3>Accorder l'accès au Dr. {doctor.fullName || doctor.name}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="duration">Durée d'accès:</label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={isLoading}
            >
              <option value="1">1 jour</option>
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">90 jours</option>
              <option value="180">180 jours (6 mois)</option>
              <option value="365">365 jours (1 an)</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isLoading}
            >
              {isLoading ? "Traitement..." : "Accorder l'accès"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AccessForm.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default AccessForm;