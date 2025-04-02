// src/components/doctor/AppointmentCalendar.jsx
import { useState } from "react";

const AppointmentCalendar = ({ appointments }) => {
  const [view, setView] = useState("month");

  return (
    <div className="appointment-calendar">
      <h3>Calendrier des rendez-vous</h3>
      <div className="calendar-controls">
        <button onClick={() => setView("day")}>Jour</button>
        <button onClick={() => setView("week")}>Semaine</button>
        <button onClick={() => setView("month")}>Mois</button>
      </div>
      <div className="calendar-content">
        <p>Vue {view} : {appointments.length} rendez-vous</p>
      </div>
    </div>
  );
};

export default AppointmentCalendar;