import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscription/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          priceId: priceId
        })
      });

      const data = await response.json();
      
      if (response.ok && data.sessionUrl) {
        window.location.href = data.sessionUrl;
      } else {
        setError(data.error?.message || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-4 text-lg text-gray-600">Get started with our flexible pricing options</p>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
          {/* Monthly Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900">Monthly Plan</h3>
              <p className="mt-4 text-gray-500">Perfect for getting started</p>
              <p className="mt-8">
                <span className="text-4xl font-bold">€4.99</span>
                <span className="text-gray-500">/month</span>
              </p>
              <button
                onClick={() => handleSubscribe(process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID)}
                disabled={loading}
                className={`mt-8 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Subscribe Monthly'}
              </button>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-indigo-500">
            <div className="px-6 py-8">
              <h3 className="text-2xl font-semibold text-gray-900">Yearly Plan</h3>
              <p className="mt-4 text-gray-500">Save with annual billing</p>
              <p className="mt-8">
                <span className="text-4xl font-bold">€49.99</span>
                <span className="text-gray-500">/year</span>
              </p>
              <button
                onClick={() => handleSubscribe(process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID)}
                disabled={loading}
                className={`mt-8 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 ${loading ? 'cursor-not-allowed' : ''}`}
              >
                {loading ? 'Processing...' : 'Subscribe Yearly'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
