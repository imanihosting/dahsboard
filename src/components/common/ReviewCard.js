import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Star, MessageCircle } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const { darkMode } = useTheme();
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < rating
            ? 'text-yellow-400 fill-current'
            : darkMode
            ? 'text-gray-600'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`p-4 rounded-xl ${
      darkMode ? 'bg-gray-700' : 'bg-gray-50'
    } transition-colors duration-200`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{review.parentName}</h3>
          <div className="flex items-center mt-1">
            {renderStars(review.rating)}
          </div>
        </div>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {formatDate(review.date)}
        </span>
      </div>
      
      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {review.comment}
      </p>

      {review.response && (
        <div className={`mt-3 p-3 rounded-lg ${
          darkMode ? 'bg-gray-600' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <MessageCircle size={16} className="text-blue-500" />
            <span>Response</span>
          </div>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {review.response}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;