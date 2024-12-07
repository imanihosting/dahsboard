import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Calendar = () => {
  const { darkMode } = useTheme();
  const [currentDate] = useState(new Date());
  const [selectedSlots, setSelectedSlots] = useState({});

  // Generate dates for the current month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSlotClick = (day, time) => {
    const slotKey = `${day}-${time}`;
    setSelectedSlots(prev => ({
      ...prev,
      [slotKey]: !prev[slotKey]
    }));
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="space-x-2">
          <button className="px-3 py-1 rounded bg-blue-600 text-white">
            Previous
          </button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white">
            Next
          </button>
        </div>
      </div>

      <div className={`rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="grid grid-cols-7">
          {weekDays.map(day => (
            <div
              key={day}
              className={`p-2 text-center font-semibold border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className={`p-2 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            />
          ))}

          {/* Calendar days */}
          {days.map((_, index) => {
            const day = index + 1;
            return (
              <div
                key={day}
                className={`p-2 border min-h-[100px] ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="font-semibold mb-1">{day}</div>
                <div className="space-y-1">
                  {timeSlots.slice(0, 2).map(time => {
                    const slotKey = `${day}-${time}`;
                    const isSelected = selectedSlots[slotKey];
                    return (
                      <div
                        key={time}
                        onClick={() => handleSlotClick(day, time)}
                        className={`text-xs p-1 rounded cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : darkMode
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </div>
                    );
                  })}
                  {timeSlots.length > 2 && (
                    <div className="text-xs text-blue-600 cursor-pointer">
                      +{timeSlots.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Schedule Setup */}
      <div className={`mt-6 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h3 className="font-semibold mb-4">Set Weekly Schedule</h3>
        <div className="space-y-3">
          {weekDays.slice(1, 6).map(day => (
            <div key={day} className="flex items-center gap-4">
              <span className="w-20">{day}</span>
              <select
                className={`p-2 rounded border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'border-gray-300'
                }`}
              >
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
              </select>
              <span>to</span>
              <select
                className={`p-2 rounded border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'border-gray-300'
                }`}
              >
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;