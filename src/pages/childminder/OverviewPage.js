import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

const OverviewPage = () => {
  const { darkMode } = useTheme();

  // Mock data for demonstration
  const data = {
    earnings: {
      today: 120,
      thisWeek: 580,
      thisMonth: 2340,
      lastMonth: 2180
    },
    upcomingBookings: [
      {
        id: 1,
        parentName: 'Sarah Johnson',
        date: '2024-12-10',
        time: '09:00 - 17:00',
        children: [
          { name: 'Emma', age: 4 },
          { name: 'James', age: 2 }
        ]
      },
      {
        id: 2,
        parentName: 'Mike Thompson',
        date: '2024-12-12',
        time: '08:00 - 16:00',
        children: [
          { name: 'Sophie', age: 3 }
        ]
      }
    ],
    recentReviews: [
      {
        id: 1,
        parentName: 'Lisa Wilson',
        rating: 5,
        comment: 'Excellent service, very flexible with timings.',
        date: '2024-12-01'
      }
    ],
    stats: {
      activeBookings: 3,
      pendingRequests: 2,
      averageRating: 4.8,
      totalChildren: 5
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Bookings', value: data.stats.activeBookings },
          { label: 'Pending Requests', value: data.stats.pendingRequests },
          { label: 'Average Rating', value: `${data.stats.averageRating}/5` },
          { label: 'Children in Care', value: data.stats.totalChildren }
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

      {/* Earnings Overview */}
      <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: "Today's Earnings", value: data.earnings.today },
            { label: 'This Week', value: data.earnings.thisWeek },
            { label: 'This Month', value: data.earnings.thisMonth },
            { label: 'Last Month', value: data.earnings.lastMonth }
          ].map((earning, index) => (
            <div key={index} className="text-center">
              <p className="text-sm opacity-75">{earning.label}</p>
              <p className="text-xl font-bold mt-1">£{earning.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming Bookings */}
        <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            <Link to="/childminder/bookings" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {data.upcomingBookings.map(booking => (
              <div
                key={booking.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <h3 className="font-semibold">{booking.parentName}</h3>
                <p className="text-sm opacity-75">{booking.date}</p>
                <p className="text-sm opacity-75">{booking.time}</p>
                <p className="text-sm mt-1">
                  Children: {booking.children.map(child => `${child.name} (${child.age})`).join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Reviews</h2>
            <Link to="/childminder/reviews" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {data.recentReviews.map(review => (
              <div
                key={review.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">{review.parentName}</h3>
                  <span className="text-sm opacity-75">{review.date}</span>
                </div>
                <div className="mt-1">{renderStars(review.rating)}</div>
                <p className="text-sm mt-2">{review.comment}</p>
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
            to="/childminder/availability"
            className="p-3 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Update Availability
          </Link>
          <Link
            to="/childminder/bookings"
            className="p-3 text-center rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            View Bookings
          </Link>
          <Link
            to="/childminder/messages"
            className="p-3 text-center rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Check Messages
          </Link>
          <Link
            to="/childminder/profile"
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