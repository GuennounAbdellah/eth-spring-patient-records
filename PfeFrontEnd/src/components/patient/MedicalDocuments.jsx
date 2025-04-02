// src/components/patient/MedicalDocuments.jsx
const MedicalDocuments = ({ documents }) => {
    return (
      <div className="medical-documents">
        <h3>Documents médicaux</h3>
        {documents?.length > 0 ? (
          <ul>
            {documents.map((doc) => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noopener noreferrer">{doc.name}</a> ({doc.type})
              </li>
            ))}
          </ul>
        ) : (
          <div className="placeholder">Aucun document disponible.</div>
        )}
      </div>
    );
  };
  
  export default MedicalDocuments;