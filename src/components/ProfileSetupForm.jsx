import React, { useState } from 'react';

// Irish counties array
const IRISH_COUNTIES = [
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare', 'Cork', 
  'Derry', 'Donegal', 'Down', 'Dublin', 'Fermanagh', 'Galway', 
  'Kerry', 'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 
  'Limerick', 'Longford', 'Louth', 'Mayo', 'Meath', 
  'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary', 
  'Tyrone', 'Waterford', 'Westmeath', 'Wexford', 'Wicklow'
].sort();

const ProfileSetupForm = () => {
  const [formData, setFormData] = useState({
    address_line1: '',
    address_line2: '',
    city: '',
    county: '',
    eircode: '',
    user_type: 'parent'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Or however you store your auth token
      
      const response = await fetch('http://localhost:5001/api/profile/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the auth token
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        // Handle success (e.g., show success message, redirect)
        console.log('Profile updated successfully');
      } else {
        // Handle error
        console.error('Profile update failed:', data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">
          Address Line 1 *
        </label>
        <input
          type="text"
          id="address_line1"
          name="address_line1"
          required
          value={formData.address_line1}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">
          Address Line 2 (Optional)
        </label>
        <input
          type="text"
          id="address_line2"
          name="address_line2"
          value={formData.address_line2}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          City *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          required
          value={formData.city}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="county" className="block text-sm font-medium text-gray-700">
          County *
        </label>
        <select
          id="county"
          name="county"
          required
          value={formData.county}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="">Select a county</option>
          {IRISH_COUNTIES.map(county => (
            <option key={county} value={county}>
              {county}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="eircode" className="block text-sm font-medium text-gray-700">
          Eircode *
        </label>
        <input
          type="text"
          id="eircode"
          name="eircode"
          required
          value={formData.eircode}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          pattern="[A-Z][0-9][0-9W][A-Z0-9]{4}"
          title="Please enter a valid Eircode (e.g., D02X285)"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Profile
      </button>
    </form>
  );
};

export default ProfileSetupForm; 