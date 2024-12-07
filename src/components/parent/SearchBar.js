import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const SearchBar = ({ onSearch }) => {
  const { darkMode } = useTheme();
  const [filters, setFilters] = useState({
    location: '',
    maxRate: '',
    ageGroup: '',
    availability: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          name="location"
          placeholder="Search by location..."
          value={filters.location}
          onChange={handleChange}
          className={`flex-1 p-2 rounded border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          }`}
        />
        <input
          type="number"
          name="maxRate"
          placeholder="Max hourly rate"
          value={filters.maxRate}
          onChange={handleChange}
          className={`w-32 p-2 rounded border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          }`}
        />
        <select
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleChange}
          className={`w-40 p-2 rounded border ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300'
          }`}
        >
          <option value="">Age Group</option>
          <option value="infant">0-1 years</option>
          <option value="toddler">1-3 years</option>
          <option value="preschool">3-5 years</option>
          <option value="schoolAge">5+ years</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;