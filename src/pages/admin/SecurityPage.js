import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  AlertTriangle,
  Flag,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

const SecurityPage = () => {
  const { darkMode } = useTheme();
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports] = useState([
    {
      id: 1,
      type: 'abuse',
      status: 'pending',
      reporter: 'Sarah Johnson',
      reported: 'John Smith',
      date: '2024-12-05',
      description: 'Inappropriate behavior reported during childminding session',
      severity: 'high'
    },
    {
      id: 2,
      type: 'suspicious',
      status: 'investigating',
      reporter: 'Emma Wilson',
      reported: 'Alice Brown',
      date: '2024-12-04',
      description: 'Suspicious activity on profile, possible fake credentials',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'verification',
      status: 'resolved',
      reporter: 'System',
      reported: 'Robert Davis',
      date: '2024-12-03',
      description: 'Failed verification check - invalid documents provided',
      severity: 'low'
    }
  ]);

  const handleAction = (action, report) => {
    switch(action) {
      case 'view':
        setSelectedReport(report);
        break;
      case 'resolve':
        if (window.confirm('Mark this report as resolved?')) {
          // Implement resolve logic
          console.log('Resolve report:', report);
        }
        break;
      case 'dismiss':
        if (window.confirm('Dismiss this report?')) {
          // Implement dismiss logic
          console.log('Dismiss report:', report);
        }
        break;
      default:
        break;
    }
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      high: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      low: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[severity]}`}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      investigating: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      resolved: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Security & Reports</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center">
            <AlertTriangle size={18} className="mr-2" />
            High Priority Reports
          </button>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={`p-4 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center mb-2">
            <Shield className="w-8 h-8 text-blue-500 mr-2" />
            <h3 className="font-semibold">Active Reports</h3>
          </div>
          <p className="text-3xl font-bold mb-1">5</p>
          <p className="text-sm text-gray-500">2 high priority</p>
        </div>

        <div className={`p-4 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center mb-2">
            <Flag className="w-8 h-8 text-yellow-500 mr-2" />
            <h3 className="font-semibold">Pending Reviews</h3>
          </div>
          <p className="text-3xl font-bold mb-1">8</p>
          <p className="text-sm text-gray-500">Average response: 2h</p>
        </div>

        <div className={`p-4 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center mb-2">
            <CheckCircle className="w-8 h-8 text-green-500 mr-2" />
            <h3 className="font-semibold">Resolved Today</h3>
          </div>
          <p className="text-3xl font-bold mb-1">12</p>
          <p className="text-sm text-gray-500">+3 from yesterday</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className={`rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`text-left ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Type</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Reported User</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports.map(report => (
                <tr key={report.id} className={`${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <td className="px-4 py-3">{report.type}</td>
                  <td className="px-4 py-3">{report.reporter}</td>
                  <td className="px-4 py-3">{report.reported}</td>
                  <td className="px-4 py-3">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-4 py-3">
                    {getSeverityBadge(report.severity)}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction('view', report)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleAction('resolve', report)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-green-500"
                        title="Resolve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleAction('dismiss', report)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-red-500"
                        title="Dismiss"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl shadow-lg max-w-lg w-full mx-4 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-bold mb-4">Report Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Type</label>
                <p className="font-medium">{selectedReport.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="font-medium">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Reporter</label>
                  <p className="font-medium">{selectedReport.reporter}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Reported User</label>
                  <p className="font-medium">{selectedReport.reported}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>{getStatusBadge(selectedReport.status)}</p>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedReport(null)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityPage;