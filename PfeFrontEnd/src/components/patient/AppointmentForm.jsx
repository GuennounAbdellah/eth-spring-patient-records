// src/components/patient/AppointmentForm.jsx
import { useState } from "react";

const AppointmentForm = ({ onSubmit, doctors }) => {
  const [specialty, setSpecialty] = useState("");
  const [location, setLocation] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [motif, setMotif] = useState("");

  const filteredDoctors = doctors
    ? doctors.filter(
        (doc) =>
          (specialty === "" || doc.specialty === specialty) &&
          (location === "" || doc.location === location)
      )
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ doctor, date, time, motif });
  };

  return (
    <div className="appointment-form">
      <h3>Prendre un rendez-vous</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Spécialité</label>
          <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
            <option value="">Sélectionner une spécialité</option>
            <option value="Cardiologie">Cardiologie</option>
            <option value="Dermatologie">Dermatologie</option>
            <option value="Généraliste">Généraliste</option>
          </select>
        </div>
        <div className="form-group">
          <label>Localisation</label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Sélectionner une localisation</option>
            <option value="Paris">Fes</option>
            <option value="Lyon">Rabat</option>
            <option value="Marseille">Tetouan</option>
          </select>
        </div>
        <div className="form-group">
          <label>Médecin</label>
          <select value={doctor} onChange={(e) => setDoctor(e.target.value)} disabled={!filteredDoctors.length}>
            <option value="">Sélectionner un médecin</option>
            {filteredDoctors.map((doc) => (
              <option key={doc.id} value={doc.id}>{doc.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Heure</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Motif du rendez-vous</label>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Décrivez le motif de votre rendez-vous..."
          />
        </div>
        <button type="submit">Confirmer le rendez-vous</button>
      </form>
    </div>
  );
};

export default AppointmentForm;