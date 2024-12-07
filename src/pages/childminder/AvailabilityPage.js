import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Calendar from '../../components/childminder/Calendar';

const AvailabilityPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Availability Calendar</h1>
      <Calendar />
    </div>
  );
};

export default AvailabilityPage;