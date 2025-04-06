import React from "react";
import PropTypes from "prop-types";
import "./DoctorList.css";

const DoctorList = ({ doctors = [], onSelectDoctor }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="no-doctors-message">
        Aucun médecin disponible pour le moment
      </div>
    );
  }

  return (
    <div className="doctor-list">
      {doctors.map((doctor) => (
        <div className="doctor-card" key={doctor.id || doctor.username}>
          <div className="doctor-info">
            <h3>{doctor.fullName || doctor.username}</h3>
            {doctor.specialization && (
              <p className="doctor-speciality">{doctor.specialization}</p>
            )}
            {doctor.hospitalAffiliation && (
              <p className="doctor-hospital">{doctor.hospitalAffiliation}</p>
            )}
          </div>
          <button 
            className="btn-grant-access" 
            onClick={() => onSelectDoctor(doctor)}
          >
            Accorder accès
          </button>
        </div>
      ))}
    </div>
  );
};

DoctorList.propTypes = {
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string.isRequired,
      fullName: PropTypes.string,
      specialization: PropTypes.string,
      hospitalAffiliation: PropTypes.string
    })
  ),
  onSelectDoctor: PropTypes.func.isRequired
};

export default DoctorList;