// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/Pages/LandingPage.jsx";
import Login from "./Components/Pages/Onboarding/login.jsx";
import Signup from "./Components/Pages/Onboarding/signup.jsx";
import CustomerSignup from "./Components/Pages/Onboarding/customerSignup.jsx";
import ProfessionalSignupStep1 from "./Components/Pages/Onboarding/ProfessionalSignupStep1.jsx";
import ProfessionalSignupStep2 from "./Components/Pages/Onboarding/ProfessionalSignupStep2.jsx";
import ProfessionalCompleteProfile from "./Components/Pages/Onboarding/ProfessionalCompleteProfile.jsx";
import CustomerDashboard from "./Components/Pages/customer/customerDashboard.jsx";
import ProfessionalDashboard from "./Components/Pages/professional/professionalDashboard.jsx";
import ProfessionalAnalytics from "./Components/Pages/professional/Analytics.jsx";
import ProfessionalAppointments from "./Components/Pages/professional/Appointments.jsx";
import ProfessionalFeedback from "./Components/Pages/professional/Feedback.jsx";
import ProfessionalCommunity from "./Components/Pages/professional/Community.jsx";
import BankDetails from "./Components/Pages/professional/BankDetails.jsx";
import Unauthorized from "./Components/Pages/Unauthorized.jsx";
import ProtectedRoute from "./Components/protectedRoute.jsx";
import Appointments from "./Components/Pages/customer/Appointments.jsx";
import Payments from "./Components/Pages/customer/Payments.jsx";
import History from "./Components/Pages/customer/History.jsx";
import Posts from "./Components/Pages/customer/Posts.jsx";
import BookingForm from "./Components/Pages/customer/BookingForm.jsx";
import ReviewForm from "./Components/Pages/customer/ReviewForm.jsx";

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
          path="/customer/booking/:replyId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customer/review/:bookingId"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <ReviewForm />
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
          path="/professional/appointment"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <ProfessionalAppointments />
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
        <Route
          path="/professional/bank-details"
          element={
            <ProtectedRoute allowedRoles={["professional"]}>
              <BankDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
