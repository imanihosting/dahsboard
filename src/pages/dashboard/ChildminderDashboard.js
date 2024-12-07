import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const ChildminderDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    tusla_registration: '',
    garda_vetting: '',
    hourly_rate: '',
    bio: '',
    subscription_status: '',
    availability: []
  });
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      // First, check if profile exists
      const profileRes = await fetch(`${process.env.REACT_APP_API_URL}/api/childminder/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!profileRes.ok) {
        // If profile doesn't exist, redirect to profile setup
        if (profileRes.status === 404) {
          navigate('/childminder/setup-profile');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      // If profile exists, fetch all data
      const [profileData, bookingsRes, messagesRes] = await Promise.all([
        profileRes.json(),
        fetch(`${process.env.REACT_APP_API_URL}/api/bookings/childminder`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const bookingsData = await bookingsRes.json();
      const messagesData = await messagesRes.json();

      setProfile(profileData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no profile data is loaded, show setup prompt
  if (!profile.first_name) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to Childminder Connect</h2>
            <p className="mt-2 text-gray-600">Please complete your profile setup to continue</p>
            <button
              onClick={() => navigate('/childminder/setup-profile')}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Setup Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your dashboard JSX remains the same
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Quick Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Active Bookings</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {Array.isArray(bookings) ? 
                bookings.filter(b => b.status === 'active').length : 
                0
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Hourly Rate</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              €{profile.hourly_rate || '0'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Tusla Status</h3>
            <p className="mt-2 text-lg font-semibold text-green-600">
              {profile.tusla_registration ? 'Registered' : 'Pending'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Garda Vetting</h3>
            <p className="mt-2 text-lg font-semibold text-green-600">
              {profile.garda_vetting ? 'Verified' : 'Pending'}
            </p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">{profile.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tusla Registration Number</p>
              <p className="font-medium">{profile.tusla_registration || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Bookings</h2>
          {loading ? (
            <p>Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{booking.parent_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.date).toLocaleDateString('en-IE')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Time: {booking.start_time} - {booking.end_time}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No upcoming bookings</p>
          )}
        </div>

        {/* Messages Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Messages</h2>
          <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4">
            {Array.isArray(messages) && messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <p className="font-medium">{message.parent_name}</p>
                  <p className="text-sm text-gray-500">{message.content}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(message.timestamp).toLocaleString('en-IE')}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No messages yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildminderDashboard; 