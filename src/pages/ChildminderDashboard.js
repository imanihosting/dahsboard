import React from 'react';
import { useAuth } from '../context/AuthContext';

const ChildminderDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-2xl font-bold mb-4">Childminder Dashboard</h2>
                <p>Welcome back, {user?.firstName}!</p>
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                  <ul className="space-y-4">
                    <li>
                      <a href="/childminder/bookings" className="text-indigo-600 hover:text-indigo-800">
                        Manage Bookings
                      </a>
                    </li>
                    <li>
                      <a href="/childminder/availability" className="text-indigo-600 hover:text-indigo-800">
                        Update Availability
                      </a>
                    </li>
                    <li>
                      <a href="/childminder/messages" className="text-indigo-600 hover:text-indigo-800">
                        Messages
                      </a>
                    </li>
                    <li>
                      <a href="/childminder/reviews" className="text-indigo-600 hover:text-indigo-800">
                        Reviews
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildminderDashboard;
