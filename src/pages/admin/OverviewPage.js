import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Users,
  DollarSign,
  Clock,
  Activity,
  Shield,
  User,
  BookOpen
} from 'lucide-react';

const OverviewPage = () => {
  const { darkMode } = useTheme();

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+22',
      icon: Users,
      color: 'text-blue-500'
    },
    {
      title: 'Active Childminders',
      value: '456',
      change: '+5',
      icon: User,
      color: 'text-green-500'
    },
    {
      title: 'Active Parents',
      value: '778',
      change: '+17',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Total Bookings',
      value: '892',
      change: '+45',
      icon: BookOpen,
      color: 'text-yellow-500'
    }
  ];

  const activityData = [
    {
      user: 'Emma Wilson',
      action: 'New Registration',
      time: '5 minutes ago',
      type: 'childminder'
    },
    {
      user: 'Sarah Johnson',
      action: 'Booking Created',
      time: '15 minutes ago',
      type: 'parent'
    },
    {
      user: 'John Smith',
      action: 'Profile Updated',
      time: '1 hour ago',
      type: 'childminder'
    }
  ];

  return (
    <div className="p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
            <div className="mt-2 text-sm text-green-500">
              {stat.change} this week
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={`rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } mb-6`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activityData.map((activity, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activity.type === 'childminder'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {activity.type}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{activity.action}</p>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className={`rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Server Load</span>
                <span className="text-sm font-medium text-green-500">23%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm font-medium text-yellow-500">67%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Storage</span>
                <span className="text-sm font-medium text-blue-500">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;