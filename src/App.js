import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ParentDashboard from './pages/dashboard/ParentDashboard';
import ChildminderDashboard from './pages/dashboard/ChildminderDashboard';
import SubscriptionPlans from './pages/subscription/SubscriptionPlans';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ParentDashboard />} />
        <Route path="/childminder/dashboard" element={<ChildminderDashboard />} />
        <Route path="/subscription/plans" element={<SubscriptionPlans />} />
      </Routes>
    </Router>
  );
};

export default App;
