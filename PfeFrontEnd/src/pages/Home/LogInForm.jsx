import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // Import for redirection
import PropTypes from 'prop-types';
import "./homApp.css";

const LogInForm = ({ onLoginSuccess }) => {
  const { login, isAuthenticated, userRoleType } = useAuth();
  const navigate = useNavigate(); // For navigation after login
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && userRoleType) {
      redirectToUserDashboard(userRoleType);
    }
  }, [isAuthenticated, userRoleType]);

  // Handle redirecting users to their appropriate dashboard
  const redirectToUserDashboard = (userType) => {
    switch(userType) {
      case 'patient':
        navigate('/patient/dashboard');
        break;
      case 'doctor':
        navigate('/doctor/dashboard');
        break;
      case 'admin':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Call the onLoginSuccess prop if provided (for parent component handling)
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        
        // Redirect based on user role
        if (result.userType) {
          redirectToUserDashboard(result.userType);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {/* Form content unchanged */}
      <h2 className="login-title">Connexion</h2>
      <div className="login-fields">
        <div className="form-field">
          <input
            className="login-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
            disabled={isLoading}
            autoComplete="username"
            required
          />
        </div>
        <div className="form-field">
          <input
            className="login-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mot de passe"
            disabled={isLoading}
            autoComplete="current-password"
            required
          />
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="forgot-password">
          <a href="#reset-password" className="forgot-link">
            Mot de passe oublié?
          </a>
        </div>
      </div>
      <button className="btn login-btn" type="submit" disabled={isLoading}>
        {isLoading ? 'Connexion en cours...' : 'Connexion'}
      </button>
    </form>
  );
};

LogInForm.propTypes = {
  onLoginSuccess: PropTypes.func
};

export default LogInForm;