import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const BookingsPage = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data for demonstration
  const bookings = {
    upcoming: [
      {
        id: 1,
        childminderName: 'Emma Williams',
        date: '2024-12-10',
        time: '09:00 - 17:00',
        children: ['Sophie (4)', 'James (2)'],
        status: 'confirmed',
        totalAmount: 120
      },
      {
        id: 2,
        childminderName: 'Sarah Smith',
        date: '2024-12-15',
        time: '08:00 - 16:00',
        children: ['Sophie (4)'],
        status: 'pending',
        totalAmount: 100
      }
    ],
    past: [
      {
        id: 3,
        childminderName: 'Emma Williams',
        date: '2024-12-01',
        time: '09:00 - 15:00',
        children: ['Sophie (4)', 'James (2)'],
        status: 'completed',
        totalAmount: 90
      }
    ],
    cancelled: [
      {
        id: 4,
        childminderName: 'Sarah Smith',
        date: '2024-12-05',
        time: '10:00 - 18:00',
        children: ['Sophie (4)'],
        status: 'cancelled',
        totalAmount: 110
      }
    ]
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    };
    return colors[status];
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        {['upcoming', 'past', 'cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-1 ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {bookings[activeTab].map(booking => (
          <div
            key={booking.id}
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{booking.childminderName}</h3>
                <p className="text-sm opacity-75">{booking.date}</p>
                <p className="text-sm opacity-75">{booking.time}</p>
                <p className="text-sm mt-2">Children: {booking.children.join(', ')}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <p className="mt-2 font-semibold">£{booking.totalAmount}</p>
                {booking.status === 'confirmed' && (
                  <button className="mt-2 text-red-600 text-sm hover:underline">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
            
            {booking.status === 'completed' && !booking.reviewed && (
              <div className="mt-4 border-t pt-4 dark:border-gray-700">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Leave Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;