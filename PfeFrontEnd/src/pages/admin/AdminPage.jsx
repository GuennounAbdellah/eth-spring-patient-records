import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../../components/layout/NavBar';
import Footer from '../../components/layout/Footer';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import './AdminPage.css';

const AdminPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Check if the user is authenticated and has the admin role
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else if (user && (!user.role || (user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN'))) {
        // Redirect to appropriate dashboard or to login if not an admin
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
    <div className="admin-layout">
      <NavBar userRole="admin" />
      <main className="admin-content">
        <Outlet />
        <Footer />
      </main>
    </div>
  );
};

export default AdminPage;