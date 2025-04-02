
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PatientInfo from "../../components/doctor/PatientInfo";
import MedicalHistory from "../../components/doctor/MedicalHistory";
import MedicalData from "../../components/doctor/MedicalData";
import ConsultationHistory from "../../components/doctor/ConsultationHistory";
import PrescriptionHistory from "../../components/doctor/PrescriptionHistory";
import AddObservation from "../../components/doctor/AddObservation";
import "./PatientRecord.css";

const PatientRecord = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [medicalData, setMedicalData] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/doctor/patient/${id}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des données du patient");
        const data = await response.json();

        setPatient({
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          age: data.age,
          sexe: data.sexe,
          adresse: data.adresse,
          telephone: data.telephone,
        });

        setMedicalHistory({
          pathologies: data.pathologies || [],
          allergies: data.allergies || [],
          familyHistory: data.familyHistory || [],
        });

        setMedicalData({
          bloodGroup: data.bloodGroup,
          currentTreatments: data.currentTreatments || [],
          testResults: data.testResults,
        });

        setConsultations(data.consultations || []);
        setPrescriptions(data.prescriptions || []);

        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  const handleAddObservation = async (data) => {
    try {
      const response = await fetch("http://localhost:8080/api/doctor/observations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ patientId: id, ...data }),
      });
      if (!response.ok) throw new Error("Erreur lors de l'ajout de l'observation");
      const newObservation = await response.json();
      setConsultations((prev) => [...prev, newObservation]);
    } catch (err) {
      console.error(err.message);
      alert("Erreur lors de l'ajout de l'observation. Veuillez vérifier que le backend est en cours d'exécution.");
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="patient-record">
      <h1>Dossier médical {patient ? `de ${patient.nom} ${patient.prenom}` : ""}</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="patient-details">
        {patient ? (
          <PatientInfo patient={patient} />
        ) : (
          <div className="placeholder">Informations du patient non disponibles.</div>
        )}
        {medicalHistory ? (
          <MedicalHistory history={medicalHistory} />
        ) : (
          <div className="placeholder">Historique médical non disponible.</div>
        )}
        {medicalData ? (
          <MedicalData data={medicalData} />
        ) : (
          <div className="placeholder">Données médicales non disponibles.</div>
        )}
        <ConsultationHistory consultations={consultations} />
        <PrescriptionHistory prescriptions={prescriptions} />
        <AddObservation onAdd={handleAddObservation} />
      </div>
    </div>
  );
};

export default PatientRecord;