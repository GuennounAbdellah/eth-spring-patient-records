// src/components/doctor/StatsCard.jsx
const StatsCard = ({ title, value, icon }) => {
    return (
      <div className="stats-card">
        <div className="stats-icon">{icon}</div>
        <div>
          <h4>{title}</h4>
          <p>{value}</p>
        </div>
      </div>
    );
  };
  
  export default StatsCard;