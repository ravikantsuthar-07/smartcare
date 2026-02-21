import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

// Auth Pages
import Landing from "./pages/auth/Landing";
import Login from "./pages/auth/Login";
import PatientRegister from "./pages/auth/PatientRegister";
import DoctorRegister from "./pages/auth/DoctorRegister";
import VerifyOTP from "./pages/auth/VerifyOTP";

// Patient Pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientAppointments from "./pages/patient/Appointments";
import BookAppointment from "./pages/patient/BookAppointment";
import PatientQueue from "./pages/patient/QueueViewer";
import PatientPrescriptions from "./pages/patient/Prescriptions";
import MedicineReminder from "./pages/patient/MedicineReminder";
import DietPrecautions from "./pages/patient/DietPrecautions";
import MedicalRecords from "./pages/patient/MedicalRecords";
import PatientNotifications from "./pages/patient/Notifications";
import PatientProfile from "./pages/patient/Profile";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorQueue from "./pages/doctor/QueueManagement";
import DoctorAppointments from "./pages/doctor/Appointments";
import CreatePrescription from "./pages/doctor/CreatePrescription";
import DoctorPrescriptions from "./pages/doctor/Prescriptions";
import PatientHistory from "./pages/doctor/PatientHistory";
import DoctorNotifications from "./pages/doctor/Notifications";
import DoctorProfile from "./pages/doctor/Profile";
import PendingVerification from "./pages/doctor/PendingVerification";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.roles)) {
    return <Navigate to="/" replace />;
  }

  // Check if doctor is verified (check both user.verification_status and user.doctor.verification_status)
  const verificationStatus =
    user?.verification_status || user?.doctor?.verification_status;
  if (user?.role === 2 && verificationStatus !== "verified") {
    return <Navigate to="/doctor/pending-verification" replace />;
  }

  return children;
};

function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/patient" element={<PatientRegister />} />
        <Route path="/register/doctor" element={<DoctorRegister />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
      </Route>

      {/* Doctor Pending Verification */}
      <Route
        path="/doctor/pending-verification"
        element={<PendingVerification />}
      />

      {/* Patient Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/book-appointment" element={<BookAppointment />} />
        <Route path="/patient/queue" element={<PatientQueue />} />
        <Route
          path="/patient/prescriptions"
          element={<PatientPrescriptions />}
        />
        <Route
          path="/patient/medicine-reminder"
          element={<MedicineReminder />}
        />
        <Route path="/patient/diet-precautions" element={<DietPrecautions />} />
        <Route path="/patient/medical-records" element={<MedicalRecords />} />
        <Route
          path="/patient/notifications"
          element={<PatientNotifications />}
        />
        <Route path="/patient/profile" element={<PatientProfile />} />
      </Route>

      {/* Doctor Routes */}
      <Route
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/queue" element={<DoctorQueue />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
        <Route
          path="/doctor/create-prescription"
          element={<CreatePrescription />}
        />
        <Route path="/doctor/patient-history" element={<PatientHistory />} />
        <Route path="/doctor/notifications" element={<DoctorNotifications />} />
        <Route path="/doctor/profile" element={<DoctorProfile />} />
      </Route>

      {/* Redirect based on role */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            user?.roles === "doctor" ? (
              <Navigate to="/doctor/dashboard" replace />
            ) : (
              <Navigate to="/patient/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
