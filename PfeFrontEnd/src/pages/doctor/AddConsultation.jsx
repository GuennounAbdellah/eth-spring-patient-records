
import { useParams } from "react-router-dom";
import ConsultationForm from "../../components/doctor/ConsultationForm";
import "./AddConsultation.css";

const AddConsultation = () => {
  const { patientId } = useParams();

  const handleSubmit = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/doctor/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId, ...data }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout de la consultation");
      console.log("Consultation ajoutée avec succès");
      alert("Consultation ajoutée avec succès !");
    } catch (err) {
      console.error(err.message);
      alert("Erreur lors de l'ajout de la consultation. Veuillez vérifier que le backend est en cours d'exécution.");
    }
  };

  return (
    <div className="add-consultation">
      <h1>Ajouter une consultation pour le patient {patientId}</h1>
      <ConsultationForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddConsultation;