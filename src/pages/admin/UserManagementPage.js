import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Search, 
  Filter,
  Ban,
  Edit,
  Trash2,
  Key,
  CheckCircle,
  XCircle
} from 'lucide-react';

const UserManagementPage = () => {
  const { darkMode } = useTheme();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users] = useState([
    {
      id: 1,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      type: 'childminder',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-12-06',
      verificationStatus: 'verified'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      type: 'parent',
      status: 'active',
      joinDate: '2024-02-01',
      lastLogin: '2024-12-05',
      verificationStatus: 'verified'
    },
    {
      id: 3,
      name: 'John Smith',
      email: 'john@example.com',
      type: 'childminder',
      status: 'suspended',
      joinDate: '2024-03-10',
      lastLogin: '2024-11-30',
      verificationStatus: 'pending'
    }
  ]);

  const handleAction = (action, user) => {
    switch(action) {
      case 'ban':
        if (window.confirm(`Are you sure you want to ban ${user.name}?`)) {
          // Implement ban logic
          console.log('Ban user:', user);
        }
        break;
      case 'edit':
        setSelectedUser(user);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
          // Implement delete logic
          console.log('Delete user:', user);
        }
        break;
      case 'reset':
        if (window.confirm(`Send password reset email to ${user.name}?`)) {
          // Implement password reset logic
          console.log('Reset password for:', user);
        }
        break;
      default:
        break;
    }
  };

  const StatusBadge = ({ status }) => {
    const getStatusStyle = () => {
      switch(status) {
        case 'active':
          return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
        case 'suspended':
          return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      }
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex gap-4">
          <div className={`flex items-center rounded-lg px-3 py-2 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <Search size={20} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              className={`ml-2 bg-transparent focus:outline-none ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            />
          </div>
          <button className={`flex items-center px-3 py-2 rounded-lg ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            <Filter size={20} className="mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`text-left ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Last Login</th>
              <th className="px-4 py-3 rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map(user => (
              <tr key={user.id} className={`${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.type === 'childminder'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                  }`}>
                    {user.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-4 py-3">
                  {user.verificationStatus === 'verified' ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="text-yellow-500 flex items-center">
                      <XCircle size={16} className="mr-1" />
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {new Date(user.lastLogin).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction('edit', user)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      title="Edit User"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleAction('ban', user)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-yellow-500"
                      title="Ban User"
                    >
                      <Ban size={18} />
                    </button>
                    <button
                      onClick={() => handleAction('reset', user)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-blue-500"
                      title="Reset Password"
                    >
                      <Key size={18} />
                    </button>
                    <button
                      onClick={() => handleAction('delete', user)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-500"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 1 to 3 of 3 entries
        </div>
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            1
          </button>
          <button className={`px-3 py-1 rounded ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}>
            Next
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl shadow-lg max-w-lg w-full mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={selectedUser.name}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  defaultValue={selectedUser.status}
                  className={`w-full px-3 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;