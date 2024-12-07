import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SearchPage = () => {
  const { darkMode } = useTheme();
  const [filters, setFilters] = useState({
    location: '',
    maxRate: '',
    ageGroup: '',
    availability: ''
  });

  // Mock data for demonstration
  const childminders = [
    {
      id: 1,
      name: 'Emma Williams',
      location: 'London, UK',
      rating: 4.8,
      reviews: 45,
      hourlyRate: 15,
      experience: '5 years',
      ageGroups: ['0-1 years', '1-3 years', '3-5 years'],
      availability: ['Monday', 'Tuesday', 'Wednesday'],
      bio: 'Experienced childminder with qualifications in early childhood education.',
      qualifications: ['Early Years Diploma', 'First Aid Certified']
    },
    {
      id: 2,
      name: 'Sarah Smith',
      location: 'Manchester, UK',
      rating: 4.9,
      reviews: 38,
      hourlyRate: 14,
      experience: '7 years',
      ageGroups: ['1-3 years', '3-5 years'],
      availability: ['Monday', 'Wednesday', 'Friday'],
      bio: 'Passionate about child development and creating fun learning experiences.',
      qualifications: ['Child Development Certificate', 'First Aid Certified']
    }
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [selectedChildminder, setSelectedChildminder] = useState(null);

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
            className={`p-2 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            }`}
          />
          <input
            type="number"
            name="maxRate"
            placeholder="Max hourly rate (£)"
            value={filters.maxRate}
            onChange={handleFilterChange}
            className={`p-2 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            }`}
          />
          <select
            name="ageGroup"
            value={filters.ageGroup}
            onChange={handleFilterChange}
            className={`p-2 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            }`}
          >
            <option value="">Select Age Group</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
          <select
            name="availability"
            value={filters.availability}
            onChange={handleFilterChange}
            className={`p-2 rounded border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
            }`}
          >
            <option value="">Select Day</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {childminders.map(childminder => (
          <div
            key={childminder.id}
            className={`p-4 rounded-lg shadow-md ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold">{childminder.name}</h3>
                <p className="text-sm opacity-75">{childminder.location}</p>
                <div className="mt-1">
                  <span className="text-yellow-500">{childminder.rating} ★</span>
                  <span className="text-sm ml-1">({childminder.reviews} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">£{childminder.hourlyRate}/hr</p>
                <p className="text-sm opacity-75">{childminder.experience}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm">{childminder.bio}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {childminder.qualifications.map((qual, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    {qual}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedChildminder(childminder)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Profile
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Profile Modal */}
      {selectedChildminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className={`max-w-2xl w-full rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } p-6`}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedChildminder.name}</h2>
                <p className="opacity-75">{selectedChildminder.location}</p>
              </div>
              <button
                onClick={() => setSelectedChildminder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* Add more detailed profile information here */}
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setSelectedChildminder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;