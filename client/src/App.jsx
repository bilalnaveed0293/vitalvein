import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DonorProfile from "./pages/DonorProfile";
import RecipientProfile from "./pages/RecipientProfile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCampaigns from "./pages/AdminCampaigns";
import DonationCenters from "./pages/DonationCenters";
import Appointments from "./pages/Appointments";
import BloodRequests from "./pages/BloodRequests";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetails";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DonorFeedback from "./pages/DonorFeedback";
import GuideRegisterDonationCenter from "./pages/GuideRegisterDonationCenter"; // New guide
import GuideRegisterDonor from "./pages/GuideRegisterDonor"; // New guide
import GuideScheduleAppointment from "./pages/GuideScheduleAppointment"; // New guide
import GuideSubmitBloodRequest from "./pages/GuideSubmitBloodRequest"; // New guide

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donation-centers" element={<DonationCenters />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/guide-register-donation-center" element={<GuideRegisterDonationCenter />} /> {/* New Guide */}
          <Route path="/guide-register-donor" element={<GuideRegisterDonor />} /> {/* New Guide */}
          <Route path="/guide-schedule-appointment" element={<GuideScheduleAppointment />} /> {/* New Guide */}
          <Route path="/guide-submit-blood-request" element={<GuideSubmitBloodRequest />} /> {/* New Guide */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/donor-profile" element={<DonorProfile />} />
            <Route path="/recipient-profile" element={<RecipientProfile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/blood-requests" element={<BloodRequests />} />
            <Route path="/feedback" element={<DonorFeedback />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/campaigns" element={<AdminCampaigns />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;