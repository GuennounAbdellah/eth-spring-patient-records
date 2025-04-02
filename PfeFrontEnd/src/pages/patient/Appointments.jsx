
import { useState, useEffect } from "react";
import AppointmentForm from "../../components/patient/AppointmentForm";
import "./Appointments.css";

const Appointments = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/patient/doctors");
        if (!response.ok) throw new Error("Erreur lors de la récupération des médecins");
        const data = await response.json();
        setDoctors(data);
        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/patient/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Erreur lors de la prise de rendez-vous");
      alert("Rendez-vous confirmé ! Vous recevrez une notification de rappel.");
    } catch (err) {
      console.error(err.message);
      alert("Erreur lors de la prise de rendez-vous. Veuillez vérifier que le backend est en cours d'exécution.");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="appointments">
      <h1>Prise de rendez-vous</h1>
      {error && <div className="error-message">{error}</div>}
      <AppointmentForm onSubmit={handleSubmit} doctors={doctors} />
    </div>
  );
};

export default Appointments;