import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          setError('No session ID found');
          setTimeout(() => navigate('/subscription/plans'), 3000);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscription/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sessionId })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const redirectPath = localStorage.getItem('redirect_after_subscription') 
            || `dashboard/${localStorage.getItem('user_type')}`;
          
          localStorage.removeItem('redirect_after_subscription');
          
          navigate(`/${redirectPath}`);
        } else {
          setError(data.message || 'Payment verification failed');
          setTimeout(() => navigate('/subscription/plans'), 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        setError('An error occurred during verification');
        setTimeout(() => navigate('/subscription/plans'), 3000);
      }
    };

    verifyPayment();
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess; 