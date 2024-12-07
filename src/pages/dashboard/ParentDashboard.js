import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    subscription_status: '',
    children: []
  });
  const [childminders, setChildminders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    age: '',
    dateOfBirth: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [profileRes, bookingsRes, childmindersRes, messagesRes, activitiesRes, contactsRes] = 
        await Promise.all([
          fetch(`${process.env.REACT_APP_API_URL}/api/parent/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/bookings/parent`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/childminders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/parent/activities`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.REACT_APP_API_URL}/api/parent/emergency-contacts`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

      const [profileData, bookingsData, childmindersData, messagesData, activitiesData, contactsData] = 
        await Promise.all([
          profileRes.ok ? profileRes.json() : null,
          bookingsRes.ok ? bookingsRes.json() : [],
          childmindersRes.ok ? childmindersRes.json() : [],
          messagesRes.ok ? messagesRes.json() : [],
          activitiesRes.ok ? activitiesRes.json() : [],
          contactsRes.ok ? contactsRes.json() : []
        ]);

      if (profileData) setProfile(profileData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setChildminders(Array.isArray(childmindersData) ? childmindersData : []);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
      setActivities(Array.isArray(activitiesData) ? activitiesData : []);
      setEmergencyContacts(Array.isArray(contactsData) ? contactsData : []);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
      setBookings([]);
      setChildminders([]);
      setMessages([]);
      setActivities([]);
      setEmergencyContacts([]);
    }
  };

  const handleSubscribe = () => {
    navigate('/subscription/plans');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!profile.subscription_status || profile.subscription_status === 'inactive') {
      setShowSubscribeModal(true);
      return;
    }
    // Handle sending message logic here
  };

  const handleBooking = () => {
    if (!profile.subscription_status || profile.subscription_status === 'inactive') {
      setShowSubscribeModal(true);
      return;
    }
    // Handle booking logic here
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
      });

      if (response.ok) {
        setShowPasswordModal(false);
        // Reset password form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        alert('Password updated successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to update password');
    }
  };

  const checkSubscription = () => {
    return profile.subscription_status === 'active';
  };

  const handleBookingButtonClick = () => {
    if (!checkSubscription()) {
      setShowSubscribeModal(true);
      return;
    }
    // Only proceed with booking if subscribed
    navigate('/make-booking');
  };

  const handleMessageButtonClick = (e) => {
    e.preventDefault();
    if (!checkSubscription()) {
      setShowSubscribeModal(true);
      return;
    }
    // Only submit the form if subscribed
    handleMessageSend(e);
  };

  const handleMessageSend = (e) => {
    e.preventDefault();
    if (!checkSubscription()) return;
    
    // Proceed with sending message only if subscribed
    // ... message sending logic
  };

  const handleAddChildClick = () => {
    setShowAddChildModal(true);
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parent/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newChild)
      });

      if (response.ok) {
        setShowAddChildModal(false);
        setNewChild({ name: '', age: '', dateOfBirth: '' });
        // Refresh dashboard data to show new child
        fetchDashboardData();
        alert('Child added successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add child');
      }
    } catch (error) {
      console.error('Error adding child:', error);
      alert('Failed to add child');
    }
  };

  const handleBookingRequest = async (childminderId) => {
    if (!checkSubscription()) {
      setShowSubscribeModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          childminder_id: childminderId,
          // Add any additional booking details you need
        })
      });

      if (response.ok) {
        alert('Booking request sent successfully!');
        // Refresh dashboard data
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to send booking request');
      }
    } catch (error) {
      console.error('Error sending booking request:', error);
      alert('Failed to send booking request');
    }
  };

  const handleAddEmergencyContact = async (contactData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parent/emergency-contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        setShowAddContactModal(false);
        // Refresh dashboard data
        fetchDashboardData();
        alert('Emergency contact added successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add emergency contact');
      }
    } catch (error) {
      console.error('Error adding emergency contact:', error);
      alert('Failed to add emergency contact');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900">Parent Dashboard</h1>

          {/* Quick Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <h3 className="text-gray-500 text-sm font-medium">Registered Children</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {profile.children?.length || 0}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-500 text-sm font-medium">Subscription Status</h3>
              <div className="mt-2 flex items-center justify-between">
                <p className={`text-lg font-semibold ${
                  profile.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {profile.subscription_status === 'active' ? 'Active' : 'Inactive'}
                </p>
                {(!profile.subscription_status || profile.subscription_status === 'inactive') && (
                  <button
                    onClick={handleSubscribe}
                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700"
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                {loading ? (
                  <p>Loading profile...</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="mt-1">{profile.first_name} {profile.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="mt-1">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="mt-1">{profile.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Subscription Status</p>
                      <p className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {profile.subscription_status || 'Not Subscribed'}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Children Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Children</h3>
                <div className="mt-4">
                  {loading ? (
                    <p>Loading children...</p>
                  ) : profile.children && profile.children.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {profile.children.map((child) => (
                        <li key={child.id} className="py-4">
                          <div className="flex space-x-3">
                            <div className="flex-1 space-y-1">
                              <h3 className="text-sm font-medium">{child.name}</h3>
                              <p className="text-sm text-gray-500">Age: {child.age} years</p>
                              <p className="text-sm text-gray-500">DOB: {new Date(child.dateOfBirth).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No children added yet</p>
                  )}
                  <button
                    onClick={handleAddChildClick}
                    className="mt-4 w-full px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Add Child
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Your Bookings</h3>
            <div className="mt-4">
              {loading ? (
                <p>Loading bookings...</p>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <p className="font-medium">{booking.childminder_name}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(booking.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">Time: {booking.time}</p>
                      <p className="text-sm text-gray-500">Status: {booking.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No bookings found</p>
              )}
              <button
                onClick={handleBookingButtonClick}
                className={`mt-4 w-full px-4 py-2 rounded-md ${
                  checkSubscription()
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'
                }`}
              >
                {checkSubscription() ? 'Make New Booking' : 'Subscribe to Make Bookings'}
              </button>
            </div>
          </div>

          {/* Messages Section */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Messages</h3>
            <div className="mt-4">
              <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4">
                {Array.isArray(messages) && messages.length > 0 ? (
                  messages.map((message) => (
                    <div key={message.id} className="mb-4">
                      <p className="font-medium">{message.sender_name}</p>
                      <p className="text-sm text-gray-500">{message.content}</p>
                      <p className="text-xs text-gray-400">{new Date(message.timestamp).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No messages yet</p>
                )}
              </div>
              <form onSubmit={handleMessageButtonClick} className="mt-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  placeholder={
                    checkSubscription() 
                      ? "Type your message..." 
                      : "Subscribe to send messages"
                  }
                />
                <button
                  type="submit"
                  className={`mt-2 w-full px-4 py-2 rounded-md ${
                    checkSubscription()
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'
                  }`}
                >
                  {checkSubscription() ? 'Send Message' : 'Subscribe to Send Messages'}
                </button>
              </form>
            </div>
          </div>

          {/* Subscribe Modal */}
          {showSubscribeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Subscription Required
                </h3>
                <p className="text-gray-600 mb-6">
                  To access this feature, you need an active subscription. Would you like to subscribe now?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowSubscribeModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowSubscribeModal(false);
                      navigate('/subscription/plans');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    View Subscription Plans
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Password Change Modal */}
          {showPasswordModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Child Modal */}
          {showAddChildModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Child</h3>
                <form onSubmit={handleAddChild} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Child's Name</label>
                    <input
                      type="text"
                      value={newChild.name}
                      onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={newChild.age}
                      onChange={(e) => setNewChild({...newChild, age: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      min="0"
                      max="17"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      value={newChild.dateOfBirth}
                      onChange={(e) => setNewChild({...newChild, dateOfBirth: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddChildModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Add Child
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Calendar View */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Booking Calendar</h3>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  Previous Month
                </button>
                <h4 className="text-lg font-medium">
                  {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  Next Month
                </button>
              </div>
              {/* Calendar grid would go here */}
            </div>
          </div>

          {/* Favorite Childminders */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Favorite Childminders</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {childminders.filter(cm => cm.isFavorite).map(childminder => (
                <div key={childminder.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{childminder.first_name} {childminder.last_name}</h4>
                      <p className="text-sm text-gray-500">{childminder.location}</p>
                    </div>
                    <button className="text-red-500 hover:text-red-600">
                      ❤️
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{childminder.bio}</p>
                    <p className="text-sm font-medium mt-2">£{childminder.hourly_rate}/hour</p>
                  </div>
                  <button 
                    className="mt-2 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    onClick={() => handleBookingRequest(childminder.id)}
                  >
                    Request Booking
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Emergency Contacts</h3>
              <button 
                onClick={() => setShowAddContactModal(true)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Add Contact
              </button>
            </div>
            <div className="space-y-4">
              {emergencyContacts.map(contact => (
                <div key={contact.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.relationship}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                  </div>
                  <button className="text-red-600 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-4 space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'booking' ? 'bg-green-100' :
                    activity.type === 'message' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'booking' ? '📅' :
                     activity.type === 'message' ? '💬' : '📌'}
                  </div>
                  <div>
                    <p className="text-sm">{activity.description}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rest of your dashboard content */}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;