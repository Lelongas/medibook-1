import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Entry from './pages/Entry';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserDashboard from './pages/UserDashboard';
import GPDashboard from './pages/GPDashboard';
import ServiceDetails from './pages/ServiceDetails';
import ProfessionalDetails from './pages/ProfessionalDetails';
import GPProfile from './pages/GPProfile';
import GPRevenue from './pages/GPRevenue';
import ReviewPage from './pages/ReviewPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import ManageSchedules from './pages/admin/ManageSchedules';
import GPBookings from './pages/admin/GPBookings';
import AdminProfile from "./pages/admin/AdminProfile"
import ReadReviews from './pages/admin/ReadReviews'; // ✅ Add this
import PendingGPApproval from './pages/admin/PendingGPApproval'; // ✅ Corrected import
import MyBookings from './pages/MyBookings';
import Notifications from './pages/Notifications';

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/entry" />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* General Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/services/:serviceId" element={<ServiceDetails />} />
        <Route path="/professionals/:professionalId" element={<ProfessionalDetails />} />
        <Route path="/user/review" element={<ReviewPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/notifications" element={<Notifications />} />
        
        {/* Dashboards */}
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/gp" element={<GPDashboard />} />
        <Route path="/gp/profile" element={<GPProfile />} />
        <Route path="/gp/revenue" element={<GPRevenue />} />
        <Route path="/gp/review" element={<ReviewPage />} />

        {/* Admin Pages */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/schedules" element={<ManageSchedules />} />
        <Route path="/admin/bookings" element={<GPBookings />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/readreviews" element={<ReadReviews />} />
       <Route path="/admin/pending-gps" element={<PendingGPApproval />} />


        {/* Fallback */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
