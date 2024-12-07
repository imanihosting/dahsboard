import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegistrationFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      // If no user, redirect to registration
      navigate('/register');
      return;
    }

    // Define the registration flow steps
    const steps = {
      1: '/register',
      2: '/subscription/plans',
      3: '/setup-profile',
      4: `/${user.role}`  // Final dashboard based on role
    };

    // Determine current step based on path
    const currentPath = location.pathname;
    let currentStep;

    if (currentPath === '/register') currentStep = 1;
    else if (currentPath.includes('/subscription')) currentStep = 2;
    else if (currentPath === '/setup-profile') currentStep = 3;
    else currentStep = 4;

    // Check if user has completed previous steps
    if (!user.registered && currentStep > 1) {
      navigate('/register');
    } else if (!user.subscription_status && currentStep > 2) {
      navigate('/subscription/plans');
    } else if (!user.has_profile && currentStep > 3) {
      navigate('/setup-profile');
    } else if (user.has_profile && currentStep < 4) {
      // If all steps are complete, redirect to dashboard
      navigate(`/${user.role}`);
    }
  }, [user, navigate, location]);

  return null; // This is just a routing controller, no UI needed
};

export default RegistrationFlow;
