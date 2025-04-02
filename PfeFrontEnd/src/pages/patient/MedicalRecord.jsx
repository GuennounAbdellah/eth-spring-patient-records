
import { useState, useEffect } from "react";
import PatientInfo from "../../components/patient/PatientInfo";
import MedicalHistory from "../../components/patient/MedicalHistory";
import ConsultationHistory from "../../components/patient/ConsultationHistory";
import PrescriptionHistory from "../../components/patient/PrescriptionHistory";
import TestResults from "../../components/patient/TestResults";
import BlockchainHistory from "../../components/patient/BlockchainHistory";
import "./MedicalRecord.css";

const MedicalRecord = () => {
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [blockchainHistory, setBlockchainHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/patient/medical-record");
        if (!response.ok) throw new Error("Erreur lors de la récupération du dossier médical");
        const data = await response.json();

        setPatient({
          nom: data.nom,
          prenom: data.prenom,
          dateOfBirth: data.dateOfBirth,
          sexe: data.sexe,
          bloodGroup: data.bloodGroup,
          allergies: data.allergies,
        });

        setMedicalHistory({
          pathologies: data.pathologies,
          vaccinations: data.vaccinations,
          surgeries: data.surgeries,
        });

        setConsultations(data.consultations || []);
        setPrescriptions(data.prescriptions || []);
        setTestResults(data.testResults || []);
        setBlockchainHistory(data.blockchainHistory || []);

        setLoading(false);
      } catch (err) {
        setError("Impossible de se connecter au serveur. Veuillez vérifier que le backend est en cours d'exécution sur http://localhost:8080.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="medical-record">
      <h1>Dossier médical</h1>
      {error && <div className="error-message">{error}</div>}
      <div className="medical-record-content">
        <PatientInfo patient={patient} />
        <MedicalHistory history={medicalHistory} />
        <ConsultationHistory consultations={consultations} />
        <PrescriptionHistory prescriptions={prescriptions} />
        <TestResults results={testResults} />
        <BlockchainHistory history={blockchainHistory} />
      </div>
    </div>
  );
};

export default MedicalRecord;