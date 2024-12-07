import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Key,
  User,
  Mail,
  Search,
  AlertTriangle,
  CheckCircle,
  LockIcon,
  UnlockIcon,
  FileText,
  Calendar
} from 'lucide-react';

const ProfileResetPage = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [resetStatus, setResetStatus] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement user search
    setSelectedUser({
      id: 1,
      name: 'John Smith',
      email: 'john@example.com',
      type: 'childminder',
      lastReset: '2024-11-30',
      accountStatus: 'active',
      loginAttempts: 2,
      lastLogin: '2024-12-05',
      isLocked: false
    });
  };

  const handlePasswordReset = () => {
    if (window.confirm(`Send password reset email to ${selectedUser.name}?`)) {
      setResetStatus({
        success: true,
        message: 'Password reset email sent successfully'
      });
      setTimeout(() => setResetStatus(null), 3000);
    }
  };

  const handleProfileUnlock = () => {
    if (window.confirm(`Unlock profile for ${selectedUser.name}?`)) {
      setResetStatus({
        success: true,
        message: 'Profile unlocked successfully'
      });
      setTimeout(() => setResetStatus(null), 3000);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile & Password Reset</h1>
      </div>

      {/* Search Form */}
      <div className={`mb-6 p-6 rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <form onSubmit={handleSearch} className="max-w-xl">
          <label className="block text-sm font-medium mb-2">
            Search User by Email or Name
          </label>
          <div className="flex gap-3">
            <div className="flex-grow relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter email or name..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-gray-100 border-gray-300'
                }`}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Reset Status Message */}
      {resetStatus && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          resetStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {resetStatus.success ? (
            <CheckCircle className="mr-2" size={20} />
          ) : (
            <AlertTriangle className="mr-2" size={20} />
          )}
          {resetStatus.message}
        </div>
      )}

      {/* User Details */}
      {selectedUser && (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
          {/* User Information Card */}
          <div className={`p-6 rounded-xl shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">User Information</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <User className="mt-1" size={20} />
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-gray-500">{selectedUser.type}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="mt-1" size={20} />
                <div>
                  <p className="font-medium">{selectedUser.email}</p>
                  <p className="text-sm text-gray-500">Primary Email</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="mt-1" size={20} />
                <div>
                  <p className="font-medium">Last Login</p>
                  <p className="text-sm text-gray-500">{selectedUser.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FileText className="mt-1" size={20} />
                <div>
                  <p className="font-medium">Account Status</p>
                  <p className={`text-sm ${
                    selectedUser.accountStatus === 'active' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {selectedUser.accountStatus.charAt(0).toUpperCase() + selectedUser.accountStatus.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className={`p-6 rounded-xl shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">Account Actions</h2>
            <div className="space-y-4">
              <button
                onClick={handlePasswordReset}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Key size={20} />
                Send Password Reset Email
              </button>
              <button
                onClick={handleProfileUnlock}
                className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${
                  selectedUser.isLocked
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : darkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-100 text-gray-400'
                }`}
                disabled={!selectedUser.isLocked}
              >
                {selectedUser.isLocked ? <UnlockIcon size={20} /> : <LockIcon size={20} />}
                {selectedUser.isLocked ? 'Unlock Profile' : 'Profile Active'}
              </button>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium mb-2">Recent Activity</h3>
                <div className="text-sm text-gray-500">
                  <p>Login Attempts: {selectedUser.loginAttempts}</p>
                  <p>Last Reset: {selectedUser.lastReset}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileResetPage;