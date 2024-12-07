import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifySubscription } = useAuth();
  const [error, setError] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId) {
        setError('Invalid session');
        return;
      }

      const result = await verifySubscription(sessionId);
      
      if (result.success) {
        // Redirect to profile setup after a short delay
        setTimeout(() => {
          navigate('/profile/setup');
        }, 3000);
      } else {
        setError(result.error || 'Failed to verify subscription');
      }
    };

    verifySession();
  }, [sessionId, verifySubscription, navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {error ? (
          <>
            <div className="text-red-600 text-xl mb-4">
              <FaCheckCircle className="mx-auto h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Subscription Error
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/subscription/plans')}
              className="w-full py-3 px-4 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <div className="text-green-600 text-xl mb-4">
              <FaCheckCircle className="mx-auto h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Subscription Successful!
            </h2>
            <p className="text-gray-600 mb-8">
              Your subscription has been activated. You'll be redirected to complete your profile setup in a moment...
            </p>
            <div className="animate-pulse">
              <div className="h-2 w-24 mx-auto bg-indigo-200 rounded"></div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionSuccess;