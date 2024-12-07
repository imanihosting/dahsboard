import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ReviewsPage = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('myReviews');

  // Mock data for demonstration
  const reviews = {
    myReviews: [
      {
        id: 1,
        childminderName: 'Emma Williams',
        date: '2024-12-01',
        rating: 5,
        comment: 'Excellent service! Emma was great with the children and very professional.',
        response: 'Thank you for your kind words! It was a pleasure looking after your children.',
        bookingDate: '2024-11-30'
      },
      {
        id: 2,
        childminderName: 'Sarah Smith',
        date: '2024-11-25',
        rating: 4,
        comment: 'Very reliable and great with kids. Would recommend.',
        response: null,
        bookingDate: '2024-11-24'
      }
    ],
    pendingReviews: [
      {
        id: 3,
        childminderName: 'Emma Williams',
        bookingDate: '2024-12-05',
        bookingDuration: '9:00 AM - 5:00 PM'
      }
    ]
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

  const [editingReview, setEditingReview] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });

  const handleSubmitReview = (bookingId) => {
    console.log('Submitting review for booking:', bookingId, newReview);
    // Here you would typically make an API call to submit the review
    setNewReview({ rating: 5, comment: '' });
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('myReviews')}
          className={`pb-2 px-1 ${
            activeTab === 'myReviews'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          My Reviews
        </button>
        <button
          onClick={() => setActiveTab('pendingReviews')}
          className={`pb-2 px-1 ${
            activeTab === 'pendingReviews'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Pending Reviews
          {reviews.pendingReviews.length > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
              {reviews.pendingReviews.length}
            </span>
          )}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {activeTab === 'myReviews' ? (
          reviews.myReviews.map(review => (
            <div
              key={review.id}
              className={`p-4 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{review.childminderName}</h3>
                  <p className="text-sm opacity-75">
                    Booking Date: {review.bookingDate}
                  </p>
                  <div className="text-lg my-1">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="text-sm opacity-75">
                  Reviewed on {review.date}
                </p>
              </div>

              <p className="mt-2">{review.comment}</p>

              {review.response && (
                <div className={`mt-4 p-3 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <p className="text-sm font-semibold">Response:</p>
                  <p className="mt-1">{review.response}</p>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setEditingReview(review)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          reviews.pendingReviews.map(booking => (
            <div
              key={booking.id}
              className={`p-4 rounded-lg shadow-md ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className="font-semibold">{booking.childminderName}</h3>
              <p className="text-sm opacity-75">
                Booking Date: {booking.bookingDate}
              </p>
              <p className="text-sm opacity-75">
                Duration: {booking.bookingDuration}
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${
                          star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    rows="4"
                    className={`w-full p-2 rounded border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                    }`}
                    placeholder="Write your review here..."
                  />
                </div>

                <button
                  onClick={() => handleSubmitReview(booking.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-6`}>
            <h2 className="text-xl font-bold mb-4">Edit Review</h2>
            {/* Add edit form here */}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setEditingReview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;