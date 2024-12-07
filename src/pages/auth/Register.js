import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    user_type: 'parent',
    bio: '',
    hourly_rate: '',
    years_experience: '',
    garda_vetting: false,
    available_from: '',
    available_to: '',
    max_children: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create the registration payload
      const registrationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.user_type,
      };

      // Add childminder specific fields only if user_type is childminder
      if (formData.user_type === 'childminder') {
        registrationData.bio = formData.bio || '';
        registrationData.hourly_rate = formData.hourly_rate || '';
        registrationData.years_experience = formData.years_experience || '';
        registrationData.garda_vetting = formData.garda_vetting || false;
        registrationData.available_from = formData.available_from || '';
        registrationData.available_to = formData.available_to || '';
        registrationData.max_children = formData.max_children || '';
      }

      console.log('Registration attempt:', registrationData);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // After successful registration, redirect to subscription
        navigate('/subscription/plans');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              {/* Left Side - Decorative */}
              <div className="md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">Welcome to Childminder Connect</h2>
                <p className="text-indigo-100 mb-6">Join Ireland's trusted childminding community</p>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                      ✓
                    </div>
                    <p>Verified Childminders</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                      ✓
                    </div>
                    <p>Garda Vetted</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
                      ✓
                    </div>
                    <p>Secure Platform</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="md:w-2/3 p-8">
                <div className="mb-8">
                  <div className="inline-flex rounded-lg bg-gray-100 p-1">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, user_type: 'parent' }))}
                      className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData.user_type === 'parent'
                          ? 'bg-white shadow text-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Parent
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, user_type: 'childminder' }))}
                      className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        formData.user_type === 'childminder'
                          ? 'bg-white shadow text-indigo-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Childminder
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        required
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {formData.user_type === 'childminder' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          name="bio"
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                          value={formData.bio}
                          onChange={handleChange}
                          placeholder="Tell us about your experience and approach to childcare..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (€)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                            <input
                              type="number"
                              name="hourly_rate"
                              min="0"
                              step="0.50"
                              className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                              value={formData.hourly_rate}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Years Experience</label>
                          <input
                            type="number"
                            name="years_experience"
                            min="0"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            value={formData.years_experience}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="flex items-center bg-indigo-50 p-4 rounded-lg">
                        <input
                          type="checkbox"
                          name="garda_vetting"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={formData.garda_vetting}
                          onChange={handleChange}
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                          I have a valid Garda Vetting
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Available From</label>
                          <input
                            type="time"
                            name="available_from"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            value={formData.available_from}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Available To</label>
                          <input
                            type="time"
                            name="available_to"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            value={formData.available_to}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Create Account
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;