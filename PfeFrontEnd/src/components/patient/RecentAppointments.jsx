// src/components/patient/RecentAppointments.jsx
const RecentAppointments = ({ appointments }) => {
    return (
      <div className="recent-appointments">
        <h3>Derniers rendez-vous</h3>
        {appointments?.length > 0 ? (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Médecin</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.date} {appointment.time}</td>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="placeholder">Aucun rendez-vous à afficher.</div>
        )}
      </div>
    );
  };
  
  export default RecentAppointments;