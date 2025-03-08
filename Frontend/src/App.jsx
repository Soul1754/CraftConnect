// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/Pages/LandingPage.jsx";
import Login from "./Components/Pages/Onboarding/Login";
import Signup from "./Components/Pages/Onboarding/Signup";
import CustomerSignup from "./Components/Pages/Onboarding/CustomerSignup";
import ProfessionalSignupStep1 from "./Components/Pages/Onboarding/ProfessionalSignupStep1";
import ProfessionalSignupStep2 from "./Components/Pages/Onboarding/ProfessionalSignupStep2";
import ProfessionalCompleteProfile from "./Components/Pages/Onboarding/ProfessionalCompleteProfile";
import CustomerDashboard from "./Components/Pages/Customer/CustomerDashboard";
import ProfessionalDashboard from "./Components/Pages/professional/professionalDashboard";
import ProfessionalAnalytics from "./Components/Pages/professional/Analytics";
import ProfessionalApp from "./Components/Pages/professional/App";
import ProfessionalFeedback from "./Components/Pages/professional/Feedback";
import ProfessionalCommunity from "./Components/Pages/professional/Community";
import Unauthorized from "./Components/Pages/Unauthorized";
import ProtectedRoute from "./Components/ProtectedRoute";
import Appointments from "./Components/Pages/Customer/Appointments";
import Payments from "./Components/Pages/Customer/Payments";
import History from "./Components/Pages/Customer/History";
import Posts from "./Components/Pages/Customer/Posts";

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
          path="/customer/appointments"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/payments"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Payments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/history"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/posts"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Posts />
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
        <Route
          path="/professional/analytics"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professional/app"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professional/feedback"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professional/community"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalCommunity />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
