import React from 'react';
import PropTypes from 'prop-types';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={`stats-card ${color || 'primary'}`}>
      <div className="stats-icon">
        {icon}
      </div>
      <div className="stats-content">
        <h3 className="stats-value">{value}</h3>
        <p className="stats-title">{title}</p>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.element,
  color: PropTypes.string
};

export default StatsCard;