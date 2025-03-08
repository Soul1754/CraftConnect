// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/Pages/LandingPage.jsx";
import Login from "./Components/Pages/Onboarding/login.jsx";
import Signup from "./Components/Pages/Onboarding/signup.jsx";
import CustomerSignup from "./Components/Pages/Onboarding/customerSignup.jsx";
import ProfessionalSignupStep1 from "./Components/Pages/Onboarding/ProfessionalSignupStep1.jsx";
import ProfessionalSignupStep2 from "./Components/Pages/Onboarding/ProfessionalSignupStep2.jsx";
import ProfessionalCompleteProfile from "./Components/Pages/Onboarding/ProfessionalCompleteProfile.jsx";
import CustomerDashboard from "./Components/Pages/Customer/CustomerDashboard.jsx";
import ProfessionalDashboard from "./Components/Pages/professional/professionalDashboard.jsx";
import ProfessionalAnalytics from "./Components/Pages/professional/Analytics.jsx";
import ProfessionalApp from "./Components/Pages/professional/App.jsx";
import ProfessionalFeedback from "./Components/Pages/professional/Feedback.jsx";
import ProfessionalCommunity from "./Components/Pages/professional/Community.jsx";
import Unauthorized from "./Components/Pages/Unauthorized.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Appointments from "./Components/Pages/Customer/Appointments.jsx";
import Payments from "./Components/Pages/Customer/Payments.jsx";
import History from "./Components/Pages/Customer/History.jsx";
import Posts from "./Components/Pages/Customer/Posts.jsx";

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
