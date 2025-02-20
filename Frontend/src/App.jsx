// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Login from "./Components/Pages/Onboarding/Login";
import Signup from "./Components/Pages/Onboarding/Signup";
import CustomerSignup from "./Components/Pages/Onboarding/CustomerSignup";
import ProfessionalSignupStep1 from "./Components/Pages/Onboarding/ProfessionalSignupStep1";
import ProfessionalSignupStep2 from "./Components/Pages/Onboarding/ProfessionalSignupStep2";
import ProfessionalCompleteProfile from "./Components/Pages/Onboarding/ProfessionalCompleteProfile";
import CustomerDashboard from "./Components/Pages/Customer/CustomerDashboard";
import ProfessionalDashboard from "./Components/Pages/professional/professionalDashboard";
import Unauthorized from "./Components/Pages/Unauthorized";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/signup/customer" element={<CustomerSignup />} />

        <Route
          path="/signup/professional/step1"
          element={<ProfessionalSignupStep1 />}
        />
        <Route
          path="/signup/professional/step2"
          element={<ProfessionalSignupStep2 />}
        />
        <Route
          path="/professional/complete-profile"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalCompleteProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professional/dashboard"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
