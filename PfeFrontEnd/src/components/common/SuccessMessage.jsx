import PropTypes from "prop-types";
import "./SuccessMessage.css";

const SuccessMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="success-message">
      <div className="success-icon">✓</div>
      <div className="success-text">{message}</div>
    </div>
  );
};

SuccessMessage.propTypes = {
  message: PropTypes.string
};

export default SuccessMessage;