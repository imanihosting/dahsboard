import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

const ProfilePage = () => {
  const { darkMode } = useTheme();
  
  const [profile, setProfile] = useState({
    personalInfo: {
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+44 7700 900000',
      location: 'London, UK',
    },
    children: [
      { id: 1, name: 'Sophie', age: 4, specialNeeds: '', allergies: 'None' },
      { id: 2, name: 'James', age: 2, specialNeeds: '', allergies: 'Peanuts' }
    ],
    preferences: {
      preferredDays: ['Monday', 'Wednesday', 'Friday'],
      preferredHours: { start: '09:00', end: '17:00' },
      maxRate: 20,
      preferredAgeGroups: ['0-5 years'],
      requirements: 'Looking for experienced childminders with first aid certification'
    },
    emergencyContacts: [
      { id: 1, name: 'John Johnson', relation: 'Spouse', phone: '+44 7700 900001' }
    ]
  });

  const [newChild, setNewChild] = useState({
    name: '',
    age: '',
    specialNeeds: '',
    allergies: ''
  });

  const [newContact, setNewContact] = useState({
    name: '',
    relation: '',
    phone: ''
  });

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

  const handleAddChild = () => {
    if (newChild.name && newChild.age) {
      setProfile(prev => ({
        ...prev,
        children: [...prev.children, { ...newChild, id: Date.now() }]
      }));
      setNewChild({ name: '', age: '', specialNeeds: '', allergies: '' });
    }
  };

  const handleRemoveChild = (id) => {
    setProfile(prev => ({
      ...prev,
      children: prev.children.filter(child => child.id !== id)
    }));
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone) {
      setProfile(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, { ...newContact, id: Date.now() }]
      }));
      setNewContact({ name: '', relation: '', phone: '' });
    }
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
        </div>
      </section>

      {/* Children Information */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Children</h2>
        <div className="space-y-4">
          {profile.children.map(child => (
            <div 
              key={child.id}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{child.name}</h3>
                  <p className="text-sm opacity-75">Age: {child.age}</p>
                  {child.allergies && (
                    <p className="text-sm opacity-75">Allergies: {child.allergies}</p>
                  )}
                  {child.specialNeeds && (
                    <p className="text-sm opacity-75">Special Needs: {child.specialNeeds}</p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveChild(child.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Child's name"
                value={newChild.name}
                onChange={e => setNewChild(prev => ({ ...prev, name: e.target.value }))}
                className={`p-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                }`}
              />
              <input
                type="number"
                placeholder="Age"
                value={newChild.age}
                onChange={e => setNewChild(prev => ({ ...prev, age: e.target.value }))}
                className={`p-2 rounded border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
                }`}
              />
            </div>
            <input
              type="text"
              placeholder="Allergies (if any)"
              value={newChild.allergies}
              onChange={e => setNewChild(prev => ({ ...prev, allergies: e.target.value }))}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
            <input
              type="text"
              placeholder="Special needs (if any)"
              value={newChild.specialNeeds}
              onChange={e => setNewChild(prev => ({ ...prev, specialNeeds: e.target.value }))}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
            <button
              onClick={handleAddChild}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Child
            </button>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
        <div className="space-y-4">
          {profile.emergencyContacts.map(contact => (
            <div
              key={contact.id}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm opacity-75">Relation: {contact.relation}</p>
              <p className="text-sm opacity-75">Phone: {contact.phone}</p>
            </div>
          ))}

          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Contact name"
              value={newContact.name}
              onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              className={`p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
            <input
              type="text"
              placeholder="Relation"
              value={newContact.relation}
              onChange={e => setNewContact(prev => ({ ...prev, relation: e.target.value }))}
              className={`p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={newContact.phone}
              onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              className={`p-2 rounded border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'border-gray-300'
              }`}
            />
          </div>
          <button
            onClick={handleAddContact}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Emergency Contact
          </button>
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