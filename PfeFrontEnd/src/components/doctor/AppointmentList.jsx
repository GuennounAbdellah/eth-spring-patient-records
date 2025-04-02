// src/components/doctor/AppointmentList.jsx
import { useState } from "react";

const AppointmentList = ({ appointments, onDelete }) => {
  const [search, setSearch] = useState("");

  const filteredAppointments = appointments
    ? appointments.filter((appointment) =>
        appointment.patient.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="appointment-list">
      <h3>Rendez-vous à venir</h3>
      <input
        type="text"
        placeholder="Rechercher un patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredAppointments.length > 0 ? (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.id}>
                <td>{appointment.patient}</td>
                <td>{appointment.date}</td>
                <td>{appointment.time}</td>
                <td>
                  <button onClick={() => onDelete(appointment.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="placeholder">Aucun rendez-vous à venir pour le moment.</div>
      )}
    </div>
  );
};

export default AppointmentList;