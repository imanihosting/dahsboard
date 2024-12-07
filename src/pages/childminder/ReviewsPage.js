import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import ReviewCard from '../../components/common/ReviewCard';

const ReviewsPage = () => {
  const { darkMode } = useTheme();
  const [reviews] = useState([
    {
      id: 1,
      parentName: 'Sarah Johnson',
      date: '2024-12-01',
      rating: 5,
      comment: "Emma is fantastic with children! She is patient, caring, and very professional. My kids love spending time with her.",
      response: null
    },
    {
      id: 2,
      parentName: 'Michael Brown',
      date: '2024-11-28',
      rating: 4,
      comment: "Great childminder, very reliable and organized. Would recommend.",
      response: "Thank you for your kind words! It's a pleasure looking after your children."
    }
  ]);

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Reviews & Ratings</h1>
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;