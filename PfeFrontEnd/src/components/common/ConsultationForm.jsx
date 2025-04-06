import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ConsultationForm.css';

const ConsultationForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="consultation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="diagnosis">Diagnostic</label>
        <textarea
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          required
          placeholder="Entrez le diagnostic principal"
        />
      </div>

      <div className="form-group">
        <label htmlFor="symptoms">Symptômes</label>
        <textarea
          id="symptoms"
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          placeholder="Décrivez les symptômes observés"
        />
      </div>

      <div className="form-group">
        <label htmlFor="treatment">Traitement</label>
        <textarea
          id="treatment"
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          placeholder="Précisez le traitement recommandé"
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes additionnelles</label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Ajoutez des notes complémentaires"
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="submit-button" 
          disabled={loading || !formData.diagnosis.trim()}
        >
          {loading ? "Enregistrement..." : "Enregistrer la consultation"}
        </button>
      </div>
    </form>
  );
};

ConsultationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

ConsultationForm.defaultProps = {
  loading: false
};

export default ConsultationForm;