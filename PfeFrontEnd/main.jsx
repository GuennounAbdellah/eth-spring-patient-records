// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./src/pages/Home/App";
import NotFound from "./src/pages/NotFound";
import AdminAddPage from "./src/pages/admin/AdminAddPage";
import DoctorPage from "./src/pages/doctor/DoctorPage";
import Dashboard from "./src/pages/doctor/Dashboard";
import Patients from "./src/pages/doctor/Patients";
import PatientRecord from "./src/pages/doctor/PatientRecord";
import AddConsultation from "./src/pages/doctor/AddConsultation";
import Appointments from "./src/pages/doctor/Appointments";
import Profile from "./src/pages/doctor/Profile";
import PatientPage from "./src/pages/patient/PatientPage";
import PatientDashboard from "./src/pages/patient/Dashboard";
import MedicalRecord from "./src/pages/patient/MedicalRecord";
import PatientAppointments from "./src/pages/patient/Appointments";
import PatientProfile from "./src/pages/patient/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/admin/admins-gestion",
    element: <AdminAddPage />,
  },
  {
    path: "/doctor",
    element: <DoctorPage />,
    children: [
      {
        index: true, // Par défaut, redirige vers /doctor/dashboard
        element: <Dashboard />,
      },
      {
        path: "dashboard", // Accessible via /doctor/dashboard
        element: <Dashboard />,
      },
      {
        path: "patients", // Accessible via /doctor/patients
        element: <Patients />,
      },
      {
        path: "patient/:id", // Accessible via /doctor/patient/1
        element: <PatientRecord />,
      },
      {
        path: "add-consultation/:patientId", // Accessible via /doctor/add-consultation/1
        element: <AddConsultation />,
      },
      {
        path: "appointments", // Accessible via /doctor/appointments
        element: <Appointments />,
      },
      {
        path: "profile", // Accessible via /doctor/profile
        element: <Profile />,
      },
    ],
  },
  {
    path: "/patient",
    element: <PatientPage />,
    children: [
      {
        index: true, // Par défaut, redirige vers /patient/dashboard
        element: <PatientDashboard />,
      },
      {
        path: "dashboard", // Accessible via /patient/dashboard
        element: <PatientDashboard />,
      },
      {
        path: "medical-record", // Accessible via /patient/medical-record
        element: <MedicalRecord />,
      },
      {
        path: "appointments", // Accessible via /patient/appointments
        element: <PatientAppointments />,
      },
      {
        path: "profile", // Accessible via /patient/profile
        element: <PatientProfile />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);