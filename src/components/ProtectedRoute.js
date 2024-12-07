import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check subscription status unless already on subscription pages
  if (!location.pathname.includes('/subscription') && 
      (!user.subscription_status || user.subscription_status === 'inactive')) {
    return <Navigate to="/subscription/plans" replace />;
  }

  // Check profile completion unless already on profile setup
  if (!location.pathname.includes('/profile') && !user.has_profile) {
    return <Navigate to="/profile/setup" replace />;
  }

  return children;
};

export default ProtectedRoute;