import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart2,
  TrendingUp,
  Users,
  Star,
  Calendar,
  DollarSign,
  Download
} from 'lucide-react';

const ReportsPage = () => {
  const { darkMode } = useTheme();
  const [timeRange, setTimeRange] = useState('week');

  const metrics = [
    {
      title: 'New Users',
      value: '125',
      trend: '+12%',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Total Bookings',
      value: '892',
      trend: '+8%',
      icon: Calendar,
      color: 'text-green-500'
    },
    {
      title: 'Average Rating',
      value: '4.8',
      trend: '+0.2',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      title: 'Revenue',
      value: '£15,234',
      trend: '+15%',
      icon: DollarSign,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics & Reports</h1>
        <div className="flex gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-2 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <h3 className="text-2xl font-bold mt-1">{metric.value}</h3>
              </div>
              <metric.icon className={`w-8 h-8 ${metric.color}`} />
            </div>
            <div className="mt-2 text-sm text-green-500 flex items-center">
              <TrendingUp size={16} className="mr-1" />
              {metric.trend} vs last period
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-xl font-bold mb-4">User Growth</h2>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <BarChart2 size={48} />
            <span className="ml-2">Chart Placeholder</span>
          </div>
        </div>

        <div className={`p-6 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-xl font-bold mb-4">Booking Trends</h2>
          <div className="h-80 flex items-center justify-center text-gray-500">
            <BarChart2 size={48} />
            <span className="ml-2">Chart Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;