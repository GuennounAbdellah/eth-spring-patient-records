
import { useState, useEffect } from "react";
import AppointmentCalendar from "../../components/doctor/AppointmentCalendar";
import AppointmentList from "../../components/doctor/AppointmentList";
import "./Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/doctor/appointments");
        if (!response.ok) throw new Error("Erreur lors de la récupération des rendez-vous");
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/doctor/appointments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression du rendez-vous");
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (err) {
      console.error(err.message);
      alert("Erreur lors de la suppression du rendez-vous. Veuillez vérifier que le backend est en cours d'exécution.");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="appointments">
      <h1>Gestion des rendez-vous</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="appointments-content">
        <div>
          <AppointmentCalendar appointments={appointments} />
        </div>
        <div>
          <AppointmentList appointments={appointments} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default Appointments;