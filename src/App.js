import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import SubscriptionPlans from './pages/subscription/SubscriptionPlans';
import SetupProfile from './pages/profile/SetupProfile';
import ChildminderDashboard from './pages/dashboard/ChildminderDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/subscription/plans" element={<SubscriptionPlans />} />
        <Route path="/profile/setup" element={<SetupProfile />} />
        <Route path="/dashboard/childminder" element={<ChildminderDashboard />} />
        <Route path="/dashboard/parent" element={<ParentDashboard />} />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
