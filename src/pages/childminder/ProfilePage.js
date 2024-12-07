import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ProfilePage = () => {
  const { darkMode } = useTheme();
  
  const [profile, setProfile] = useState({
    personalInfo: {
      fullName: 'Emma Williams',
      email: 'emma@example.com',
      phone: '+44 7700 900123',
      location: 'London, UK',
      aboutMe: 'Experienced childminder with over 5 years of experience working with children of all ages. Certified in first aid and early childhood education.',
    },
    qualifications: [
      { id: 1, title: 'Early Years Childcare Diploma', year: '2020' },
      { id: 2, title: 'Pediatric First Aid Certificate', year: '2023' },
      { id: 3, title: 'Child Protection Training', year: '2023' }
    ],
    services: {
      hourlyRate: 15,
      ageGroups: ['0-1 years', '1-3 years', '3-5 years'],
      availability: {
        monday: { start: '08:00', end: '18:00' },
        tuesday: { start: '08:00', end: '18:00' },
        wednesday: { start: '08:00', end: '18:00' },
        thursday: { start: '08:00', end: '18:00' },
        friday: { start: '08:00', end: '18:00' }
      }
    }
  });

  const [newQualification, setNewQualification] = useState({ title: '', year: '' });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [name]: value
      }
    }));
  };

  const handleQualificationAdd = () => {
    if (newQualification.title && newQualification.year) {
      setProfile(prev => ({
        ...prev,
        qualifications: [
          ...prev.qualifications,
          { ...newQualification, id: Date.now() }
        ]
      }));
      setNewQualification({ title: '', year: '' });
    }
  };

  const handleQualificationDelete = (id) => {
    setProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter(q => q.id !== id)
    }));
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {/* Personal Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.personalInfo.fullName}
              onChange={handlePersonalInfoChange}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.personalInfo.email}
              onChange={handlePersonalInfoChange}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profile.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={profile.personalInfo.location}
              onChange={handlePersonalInfoChange}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">About Me</label>
            <textarea
              name="aboutMe"
              value={profile.personalInfo.aboutMe}
              onChange={handlePersonalInfoChange}
              rows="4"
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
      </section>

      {/* Qualifications */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Qualifications & Certifications</h2>
        <div className="space-y-4">
          {profile.qualifications.map(qual => (
            <div 
              key={qual.id}
              className={`p-3 rounded-lg flex justify-between items-center ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div>
                <h3 className="font-medium">{qual.title}</h3>
                <p className="text-sm opacity-75">Year: {qual.year}</p>
              </div>
              <button
                onClick={() => handleQualificationDelete(qual.id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Qualification title"
              value={newQualification.title}
              onChange={e => setNewQualification(prev => ({ ...prev, title: e.target.value }))}
              className={`flex-1 p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
            <input
              type="text"
              placeholder="Year"
              value={newQualification.year}
              onChange={e => setNewQualification(prev => ({ ...prev, year: e.target.value }))}
              className={`w-24 p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
            <button
              onClick={handleQualificationAdd}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      </section>

      {/* Services & Rates */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Services & Rates</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hourly Rate (£)</label>
            <input
              type="number"
              value={profile.services.hourlyRate}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                services: { ...prev.services, hourlyRate: e.target.value }
              }))}
              className={`w-32 p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age Groups</label>
            <div className="space-y-2">
              {['0-1 years', '1-3 years', '3-5 years', '5+ years'].map(age => (
                <label key={age} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={profile.services.ageGroups.includes(age)}
                    onChange={(e) => {
                      const newAgeGroups = e.target.checked
                        ? [...profile.services.ageGroups, age]
                        : profile.services.ageGroups.filter(g => g !== age);
                      setProfile(prev => ({
                        ...prev,
                        services: { ...prev.services, ageGroups: newAgeGroups }
                      }));
                    }}
                    className="mr-2"
                  />
                  {age}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;