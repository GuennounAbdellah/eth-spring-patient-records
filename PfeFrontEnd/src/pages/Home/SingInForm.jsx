import  { useState } from "react";
import "./homApp.css";

const SignInForm = () => {
  const [formData, setFormData] = useState({
    profil: '',
    email: '',
    password: ''
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
    console.log(formData);
    //  more logic here to handle the form submissionto be added
  };

//const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <form className="SignInForm" onSubmit={handleSubmit}>
      <div className="choice">
        <h1 className="formTitle">Vous êtes : </h1>
        <select className="choiceInput" name="profil" id="profil" value={formData.profil} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="prfSantee">Profissionnel de santé</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <fieldset>
        <div className="inputs">
          <div className="relative">
            <input
            className="singInInput"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="relative">
            <input
              className="singInInput"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
                  <div className="oublie">
            <p>
              Vous avez oublié le mot de passe ?{" "}
              <a href="#oublie" className="oublie-link">
              Cliquez ici
              </a>
            </p>


          </div>
        </div>
      </fieldset>
      <button className="btn" type="submit">Submit</button>
    </form>
  );
};

export default SignInForm;