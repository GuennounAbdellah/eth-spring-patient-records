import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import './PatientPage.css';

const PatientPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated and has the patient role
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (user && (!user.role || user.role !== 'PATIENT')) {
        // Redirect to appropriate dashboard based on role or to login if not a patient
        navigate('/', { replace: true });
      } else {
        setPageLoading(false);
      }
    }
  }, [isAuthenticated, user, isLoading, navigate]);

  if (isLoading || pageLoading) {
    return <LoadingIndicator message="Chargement..." />;
  }

  return (
    <div className="patient-layout">
      <NavBar userRole="patient" />
      <main className="patient-content">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default PatientPage;
