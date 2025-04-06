import PropTypes from 'prop-types';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'confirmé':
      case 'active':
      case 'actif':
        return 'status-badge status-confirmed';
      case 'pending':
      case 'en attente':
        return 'status-badge status-pending';
      case 'canceled':
      case 'annulé':
      case 'inactive':
      case 'inactif':
        return 'status-badge status-canceled';
      default:
        return 'status-badge';
    }
  };

  const getStatusText = () => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'canceled':
        return 'Annulé';
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      default:
        return status;
    }
  };

  return (
    <span className={getStatusClass()}>
      {getStatusText()}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired
};

export default StatusBadge;