import {  useState } from "react";
import PropTypes from "prop-types";

 function ModelFormAjtP({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    insuranceName: "",
    CNSSNubmer: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can add more logic here to handle the form submission
    onClose();
  };
  const handleReturn = (e) => {
    e.preventDefault();
    onClose();
  };

  if (!isOpen) return null;
  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="section">
          <fieldset>
            <legend>Informations Presonnelles : </legend>
            <div className="form-group">
              <label htmlFor="fullName">Nom complet :</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="birthDate">Date de naissance :</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input type="radio" name="gender" value="male" /> Homme
              </label>
              <label>
                <input type="radio" name="gender" value="female" /> Femme
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Téléphone :</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Adresse :</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>En cas d&apos;urgence</legend>
            <div className="form-group">
              <label htmlFor="emergencyName">
                Nom du contact d&apos;urgence :
              </label>
              <input
                type="text"
                id="emergencyName"
                name="emergencyName"
                value={formData.emergencyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="emergencyRelation">
                Relation avec le contact d&apos;urgence :
              </label>
              <input
                type="text"
                id="emergencyRelation"
                name="emergencyRelation"
                value={formData.emergencyRelation}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="emergencyPhone">
                Téléphone du contact d&apos;urgence :
              </label>
              <input
                type="tel"
                id="emergencyPhone"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleChange}
                required
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>CNSS et Assurance</legend>
            <div className="form-group">
              <label htmlFor="policyNumber">Numéro de la CNCC :</label>
              <input
                type="text"
                id="CNSSNubmer"
                name="CNSSNubmer"
                value={formData.CNSSNubmer}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="insuranceName">Nom de l&apos;assurance :</label>
              <input
                type="text"
                id="insuranceName"
                name="insuranceName"
                value={formData.insuranceName}
                onChange={handleChange}
              />
            </div>
          </fieldset>
          <button className="close-button" type="submit">
            Submit
          </button>
          <button className="close-button" id="returnButoon" type='button' onClick={handleReturn} >
            Return
          </button>
        </div>
      </form>
    </>
  );
}
ModelFormAjtP.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModelFormAjtP;


