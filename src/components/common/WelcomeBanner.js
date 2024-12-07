import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

const WelcomeBanner = ({ userName, userType, summary }) => {
  const { darkMode } = useTheme();
  const currentTime = new Date().getHours();
  
  const getGreeting = () => {
    if (currentTime < 12) return 'Good morning';
    if (currentTime < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className={`rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Greeting Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold">
          {getGreeting()}, {userName}!
        </h2>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Here's what's happening with your {userType} profile today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        {summary.map((item, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-50 hover:bg-gray-100'
            } transition-colors duration-200`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.label}
                </p>
                <h3 className="text-2xl font-bold mt-1">{item.value}</h3>
              </div>
              {item.trend && (
                <div className={`flex items-center ${
                  item.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.trend === 'up' ? (
                    <TrendingUp size={20} />
                  ) : (
                    <TrendingDown size={20} />
                  )}
                </div>
              )}
            </div>
            {item.trendValue && (
              <p className={`text-sm mt-2 ${
                item.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {item.trendValue}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;