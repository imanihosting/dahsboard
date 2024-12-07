import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

const SubscriptionCancel = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/subscription/plans');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Subscription Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          The subscription process was cancelled. You can try again whenever you're ready.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting back to plans in {countdown} seconds...
        </p>
        <button
          onClick={() => navigate('/subscription/plans')}
          className="mt-6 w-full bg-indigo-600 text-white rounded-lg py-2 px-4 hover:bg-indigo-700 transition duration-200"
        >
          Return to Plans
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCancel; 