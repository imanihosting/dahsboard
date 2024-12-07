import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
  const { darkMode } = useTheme();

  // Mock data for demonstration
  const data = {
    upcomingBookings: [
      {
        id: 1,
        childminderName: 'Emma Williams',
        date: '2024-12-10',
        time: '09:00 - 17:00',
        children: ['Sophie (4)', 'James (2)'],
        status: 'confirmed'
      },
      {
        id: 2,
        childminderName: 'Sarah Smith',
        date: '2024-12-15',
        time: '08:00 - 16:00',
        children: ['Sophie (4)'],
        status: 'pending'
      }
    ],
    savedChildminders: [
      {
        id: 1,
        name: 'Emma Williams',
        rating: 4.8,
        location: 'London',
        hourlyRate: 15
      },
      {
        id: 2,
        name: 'Sarah Smith',
        rating: 4.9,
        location: 'Manchester',
        hourlyRate: 14
      }
    ],
    stats: {
      activeBookings: 2,
      savedChildminders: 5,
      totalBookings: 12,
      pendingRequests: 1
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Bookings', value: data.stats.activeBookings },
          { label: 'Saved Childminders', value: data.stats.savedChildminders },
          { label: 'Total Bookings', value: data.stats.totalBookings },
          { label: 'Pending Requests', value: data.stats.pendingRequests }
        ].map((stat, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}
          >
            <h3 className="text-sm opacity-75">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            <Link to="/parent/bookings" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {data.upcomingBookings.map(booking => (
              <div
                key={booking.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">{booking.childminderName}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-sm opacity-75">{booking.date}</p>
                <p className="text-sm opacity-75">{booking.time}</p>
                <p className="text-sm mt-1">
                  Children: {booking.children.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Childminders */}
        <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Saved Childminders</h2>
            <Link to="/parent/search" className="text-blue-600 hover:underline">
              Find More
            </Link>
          </div>
          <div className="space-y-4">
            {data.savedChildminders.map(childminder => (
              <div
                key={childminder.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">{childminder.name}</h3>
                    <p className="text-sm opacity-75">{childminder.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-500">
                      {childminder.rating} ★
                    </div>
                    <p className="text-sm">£{childminder.hourlyRate}/hr</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/parent/search"
            className="p-3 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Find Childminder
          </Link>
          <Link
            to="/parent/bookings"
            className="p-3 text-center rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            View Bookings
          </Link>
          <Link
            to="/parent/messages"
            className="p-3 text-center rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Messages
          </Link>
          <Link
            to="/parent/profile"
            className="p-3 text-center rounded-lg bg-orange-600 text-white hover:bg-orange-700"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;