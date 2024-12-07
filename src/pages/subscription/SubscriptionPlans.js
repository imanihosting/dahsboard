import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('Price ID:', priceId);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/subscription/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ priceId })
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.message || 'Failed to create subscription session');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
          <p className="mt-2 text-gray-600">Select a subscription plan to continue</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Monthly Plan */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Monthly Plan</h3>
                <p className="text-gray-500">€4.99/month</p>
              </div>
              <button
                onClick={() => handleSubscribe('price_1QQ61DE8w0VgApNuoRjufjA4')}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          </div>

          {/* Yearly Plan */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-indigo-500">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Yearly Plan</h3>
                <p className="text-gray-500">€49.99/year</p>
                <p className="text-sm text-indigo-600">Save over 16%</p>
              </div>
              <button
                onClick={() => handleSubscribe('price_1QS2edE8w0VgApNu5txn9m8c')}
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Subscribe'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
