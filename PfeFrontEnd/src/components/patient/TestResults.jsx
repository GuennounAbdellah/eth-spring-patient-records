// src/components/patient/TestResults.jsx
const TestResults = ({ results }) => {
    return (
      <div className="test-results">
        <h3>Résultats d’analyses et radios</h3>
        {results?.length > 0 ? (
          <ul>
            {results.map((result) => (
              <li key={result.id}>
                <a href={result.url} target="_blank" rel="noopener noreferrer">{result.name}</a> ({result.type}) - {result.date}
              </li>
            ))}
          </ul>
        ) : (
          <div className="placeholder">Aucun résultat disponible.</div>
        )}
      </div>
    );
  };
  
  export default TestResults;