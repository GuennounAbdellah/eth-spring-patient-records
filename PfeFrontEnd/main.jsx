import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './src/pages/Home/App';
import NotFound from './src/pages/NotFound';
import AdminAddPage from './src/pages/admin/AdminAddPage';
import DoctorPage from './src/pages/doctor/DoctorPage';
import PatientPage from './src/pages/patient/PatientPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement :<NotFound />
  },
  {
    path:'/admin/admins-gestion',
    element : <AdminAddPage />
    
  },
  {
    path:'/doctor',
    element : <DoctorPage />
  },
  {
    path:'/patient',
    element : <PatientPage />
  },
]);

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);