import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Panel (formerly Sidebar) */}
      <div className="bg-white/70 backdrop-blur-sm w-full mb-8">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user?.firstName}</p>
            </div>
          </div>
          <nav>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { title: 'User Management', href: '/admin/users', icon: '👥' },
                { title: 'Reports', href: '/admin/reports', icon: '📊' },
                { title: 'System Settings', href: '/admin/settings', icon: '⚙️' },
                { title: 'Security Settings', href: '/admin/security', icon: '🔒' },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-6 py-3 text-gray-600 
                            hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.title}</span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Total Users', value: '--', color: 'from-blue-500/40' },
            { title: 'Active Bookings', value: '--', color: 'from-green-500/40' },
            { title: 'Revenue', value: '$--', color: 'from-purple-500/40' },
            { title: 'Active Sessions', value: '--', color: 'from-yellow-500/40' },
          ].map((stat) => (
            <div 
              key={stat.title} 
              className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border-0 
                        transition-all duration-300 hover:bg-white/80
                        bg-gradient-to-r ${stat.color} to-transparent"
            >
              <p className="text-sm text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:bg-white/80">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
