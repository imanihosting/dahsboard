import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import BookingCard from '../../components/common/BookingCard';

const BookingsPage = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('upcoming');

  // Mock data for demonstration
  const mockBookings = {
    upcoming: [
      {
        id: 1,
        parentName: 'Sarah Johnson',
        date: '2024-12-10',
        startTime: '09:00',
        endTime: '17:00',
        status: 'confirmed',
        totalAmount: 120,
        children: [
          { name: 'Emma', age: 4 },
          { name: 'James', age: 2 }
        ]
      },
      {
        id: 2,
        parentName: 'Mike Thompson',
        date: '2024-12-12',
        startTime: '08:00',
        endTime: '16:00',
        status: 'pending',
        totalAmount: 100,
        children: [
          { name: 'Sophie', age: 3 }
        ]
      }
    ],
    past: [
      {
        id: 3,
        parentName: 'Lisa Wilson',
        date: '2024-12-01',
        startTime: '09:00',
        endTime: '15:00',
        status: 'completed',
        totalAmount: 90,
        children: [
          { name: 'Oliver', age: 5 }
        ]
      }
    ],
    cancelled: [
      {
        id: 4,
        parentName: 'David Brown',
        date: '2024-12-05',
        startTime: '10:00',
        endTime: '18:00',
        status: 'cancelled',
        totalAmount: 110,
        children: [
          { name: 'Lucy', age: 4 }
        ]
      }
    ]
  };

  const [bookings, setBookings] = useState(mockBookings);

  const handleStatusChange = (bookingId, newStatus) => {
    setBookings(prevBookings => {
      const updatedBookings = { ...prevBookings };
      
      // Find and update the booking in all categories
      Object.keys(updatedBookings).forEach(category => {
        const bookingIndex = updatedBookings[category].findIndex(b => b.id === bookingId);
        if (bookingIndex !== -1) {
          const booking = { ...updatedBookings[category][bookingIndex] };
          booking.status = newStatus;
          
          // Remove from current category
          updatedBookings[category] = updatedBookings[category].filter(b => b.id !== bookingId);
          
          // Add to appropriate category
          if (newStatus === 'cancelled') {
            updatedBookings.cancelled.push(booking);
          } else if (newStatus === 'completed') {
            updatedBookings.past.push(booking);
          } else {
            updatedBookings.upcoming.push(booking);
          }
        }
      });
      
      return updatedBookings;
    });
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

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
            {tab === 'upcoming' && bookings.upcoming.filter(b => b.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                {bookings.upcoming.filter(b => b.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {bookings[activeTab].length > 0 ? (
          bookings[activeTab].map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onStatusChange={handleStatusChange}
              userType="childminder"
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No {activeTab} bookings found
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;