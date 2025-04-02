// src/components/doctor/ConsultationForm.jsx
import { useState } from "react";

const ConsultationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    motif: "",
    observations: "",
    diagnostic: "",
    prescription: "",
    files: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="consultation-form">
      <h3>Ajouter une consultation</h3>
      <form onSubmit={handleSubmit}>
        <label>Date de la consultation</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        <label>Motif de consultation</label>
        <input
          type="text"
          name="motif"
          value={formData.motif}
          onChange={handleChange}
        />
        <label>Examen clinique et observations</label>
        <textarea
          name="observations"
          value={formData.observations}
          onChange={handleChange}
        />
        <label>Diagnostic</label>
        <input
          type="text"
          name="diagnostic"
          value={formData.diagnostic}
          onChange={handleChange}
        />
        <label>Prescription médicale</label>
        <textarea
          name="prescription"
          value={formData.prescription}
          onChange={handleChange}
        />
        <label>Ajouter des fichiers médicaux</label>
        <input
          type="file"
          name="files"
          onChange={handleChange}
        />
        <button type="submit">Ajouter la consultation</button>
      </form>
    </div>
  );
};

export default ConsultationForm;