import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const BookingForm = ({ onSubmit, initialData = null }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState(initialData || {
    date: '',
    startTime: '',
    duration: '',
    children: [{ name: '', age: '' }],
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChildChange = (index, field, value) => {
    const newChildren = [...formData.children];
    newChildren[index] = {
      ...newChildren[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      children: newChildren
    }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '' }]
    }));
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full p-2 rounded border ${
              darkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Duration (hours)</label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          min="1"
          max="12"
          className={`w-full p-2 rounded border ${
            darkMode
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Children</label>
        {formData.children.map((child, index) => (
          <div key={index} className="flex gap-4 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={child.name}
              onChange={(e) => handleChildChange(index, 'name', e.target.value)}
              className={`flex-1 p-2 rounded border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
            <input
              type="number"
              placeholder="Age"
              value={child.age}
              onChange={(e) => handleChildChange(index, 'age', e.target.value)}
              className={`w-20 p-2 rounded border ${
                darkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300'
              }`}
              required
            />
            {formData.children.length > 1 && (
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="px-3 py-1 text-red-600 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addChild}
          className="text-blue-600 hover:underline text-sm"
        >
          + Add Another Child
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className={`w-full p-2 rounded border ${
            darkMode
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-300'
          }`}
        ></textarea>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {initialData ? 'Update Booking' : 'Create Booking'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;