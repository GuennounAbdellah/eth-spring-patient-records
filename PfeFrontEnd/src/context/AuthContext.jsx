// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Vérifier si un token existe au chargement de l'application
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Simuler un utilisateur connecté (puisque le backend n'est pas prêt)
      setUser({ role: "doctor" }); // Remplace par une requête au backend plus tard
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ role: "doctor" }); // Simuler un utilisateur connecté
    navigate("/doctor/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Rediriger vers la page de connexion
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};