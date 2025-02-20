import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./Components/Pages/LandingPage";
import Login from "./Components/Pages/Onboarding/Login";
import Signup from "./Components/Pages/Onboarding/Signup";
import CustomerSignup from "./Components/Pages/Onboarding/customerSignup";
import CustomerDashboard from "./Components/Pages/customer/customerDashboard";
import ProfessionalDashboard from "./Components/Pages/professional/professionalDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/customer" element={<CustomerSignup />} />
        <Route path="/customer/Dashboard" element={<CustomerDashboard />} />
        <Route path="/professional/Dashboard" element={<ProfessionalDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
