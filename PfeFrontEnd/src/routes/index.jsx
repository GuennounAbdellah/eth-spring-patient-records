import { createBrowserRouter } from "react-router-dom";

// Pages
import NotFound from '../pages/NotFound';

// Admin
import AdminPage from "../pages/admin/AdminPage";
import AdminDashboard from "../pages/admin/dashboard/Dashboard";
import AdminProfile from "../pages/admin/profile/ProfilePage"; 
import AuditPage from "../pages/admin/audit/AuditPage"; 

// Doctor
import DoctorPage from "../pages/doctor/DoctorPage"; 
import DoctorDashboard from "../pages/doctor/Dashboard";
import Patients from "../pages/doctor/Patients";
import PatientRecord from "../pages/doctor/PatientRecord";
import AddConsultation from "../pages/doctor/AddConsultation";
import DoctorProfile from "../pages/doctor/Profile";

// Patient
import PatientPage from "../pages/patient/PatientPage";
import PatientDashboard from "../pages/patient/Dashboard";
import MedicalRecord from "../pages/patient/MedicalRecord";
import DoctorAccess from "../pages/patient/DoctorAccess";
import PatientProfile from "../pages/patient/Profile";

// Auth
import LoginPage from "../pages/Home/HomePage"; 
import RegisterPage from "../pages/Home/HomePage";

// Landing and Error
import LandingPage from "../pages/Home/HomePage";
import ErrorPage from "../pages/NotFound";

// Import UsersManager only once
import UsersManager from "../pages/admin/users/UsersManager";

// Auth components
const AuthRequired = ({ children }) => children;
const RoleRequired = ({ children }) => children;

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/patient",
    element: (
      <AuthRequired>
        <RoleRequired role="ROLE_PATIENT">
          <PatientPage />
        </RoleRequired>
      </AuthRequired>
    ),
    children: [
      {
        path: "dashboard",
        element: <PatientDashboard />,
      },
      {
        path: "medical-record",
        element: <MedicalRecord />,
      },
      {
        path: "doctor-access",
        element: <DoctorAccess />,
      },
      {
        path: "profile",
        element: <PatientProfile />,
      },
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/doctor",
    element: (
      <AuthRequired>
        <RoleRequired role="ROLE_DOCTOR">
          <DoctorPage />
        </RoleRequired>
      </AuthRequired>
    ),
    children: [
      {
        path: "dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "patients",
        element: <Patients />,
      },
      {
        path: "patient/:id",
        element: <PatientRecord />,
      },
      {
        path: "add-consultation/:patientId",
        element: <AddConsultation />,
      },
      {
        path: "profile",
        element: <DoctorProfile />,
      },
      {
        path: "",
        element: <DoctorDashboard />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AuthRequired>
        <RoleRequired role="ROLE_ADMIN">
          <AdminPage />
        </RoleRequired>
      </AuthRequired>
    ),
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <UsersManager />,
      },
      {
        path: "profile",
        element: <AdminProfile />,
      },
      {
        path: "audit", 
        element: <AuditPage />,
      },
      {
        path: "",
        element: <AdminDashboard />,
      },
    ],
  },
]);

export default router;