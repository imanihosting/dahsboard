import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const BookingCard = ({ booking, onStatusChange, userType }) => {
  const { darkMode } = useTheme();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`p-4 rounded-lg border ${
      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">
            {userType === 'parent' ? booking.childminderName : booking.parentName}
          </h3>
          <p className="text-sm opacity-75">
            {formatDate(booking.date)}
          </p>
          <p className="text-sm opacity-75">
            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
          </p>
          {booking.children && (
            <p className="text-sm mt-2">
              Children: {booking.children.map(child => `${child.name} (${child.age})`).join(', ')}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
          <p className="mt-2 font-semibold">£{booking.totalAmount}</p>
        </div>
      </div>

      {userType === 'childminder' && booking.status === 'pending' && (
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={() => onStatusChange(booking.id, 'confirmed')}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={() => onStatusChange(booking.id, 'cancelled')}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Decline
          </button>
        </div>
      )}

      {booking.status === 'confirmed' && (
        <div className="mt-4">
          <button
            onClick={() => onStatusChange(booking.id, 'cancelled')}
            className="text-red-600 hover:underline text-sm"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;