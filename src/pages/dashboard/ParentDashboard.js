import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaEnvelope, FaPhone, FaSignOutAlt } from 'react-icons/fa';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleLogout = () => {
    // Clear all stored data
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('user_id');
    
    // Redirect to login
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/dashboard/parent`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Dashboard error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section with Logout */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome, {userData?.first_name}!</h1>
              <p className="text-gray-600 mt-1">Manage your childcare bookings and communications here.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bookings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Bookings</h2>
              <FaCalendar className="text-indigo-600" />
            </div>
            {userData?.bookings && userData.bookings.length > 0 ? (
              <ul className="space-y-3">
                {userData.bookings.map((booking, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">{booking.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No bookings yet</p>
            )}
            <button 
              onClick={() => navigate('/bookings/new')}
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Book Childcare
            </button>
          </div>

          {/* Messages Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Messages</h2>
              <FaEnvelope className="text-indigo-600" />
            </div>
            {userData?.messages && userData.messages.length > 0 ? (
              <ul className="space-y-3">
                {userData.messages.map((message, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="font-medium">{message.subject}</p>
                    <p className="text-sm text-gray-600">{message.preview}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No messages</p>
            )}
            <button 
              onClick={() => navigate('/messages')}
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              View All Messages
            </button>
          </div>

          {/* Emergency Contacts Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
              <FaPhone className="text-indigo-600" />
            </div>
            {userData?.emergency_contacts && userData.emergency_contacts.length > 0 ? (
              <ul className="space-y-3">
                {userData.emergency_contacts.map((contact, index) => (
                  <li key={index} className="border-b pb-2">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No emergency contacts added</p>
            )}
            <button 
              onClick={() => navigate('/contacts/new')}
              className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              Add Emergency Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
