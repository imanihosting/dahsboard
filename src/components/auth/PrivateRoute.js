import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has that role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    return <Navigate to={`/${user.role}`} replace />;
  }

  // If user hasn't completed profile setup
  if (!user.has_profile && window.location.pathname !== '/setup-profile') {
    return <Navigate to="/setup-profile" replace />;
  }

  // If user needs subscription (except for admin)
  if ((!user.subscription_status || user.subscription_status === 'inactive') && 
      user.role !== 'admin' && 
      window.location.pathname !== '/subscription/plans') {
    return <Navigate to="/subscription/plans" replace />;
  }

  return children;
};

export default PrivateRoute;
