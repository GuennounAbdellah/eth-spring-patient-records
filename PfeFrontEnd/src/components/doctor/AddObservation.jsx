// src/components/doctor/AddObservation.jsx
import { useState } from "react";
import jsPDF from "jspdf";

const AddObservation = ({ onAdd }) => {
  const [observation, setObservation] = useState("");
  const [prescription, setPrescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ observation, prescription });

    // Générer un PDF pour l'ordonnance
    const doc = new jsPDF();
    doc.text("Ordonnance", 10, 10);
    doc.text(prescription, 10, 20);
    doc.save("ordonnance.pdf");

    setObservation("");
    setPrescription("");
  };

  return (
    <div className="add-observation">
      <h3>Ajouter une observation</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Compte rendu médical..."
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
        <textarea
          placeholder="Prescription médicale..."
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddObservation;