import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Test users for demonstration
const TEST_USERS = {
  'parent@test.com': {
    id: '1',
    email: 'parent@test.com',
    password: 'parent123',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'parent',
    profileCompleted: true,
    subscription: true,
    phoneNumber: '123-456-7890',
    address: '123 Parent St',
    bio: 'Parent of two lovely children'
  },
  'childminder@test.com': {
    id: '2',
    email: 'childminder@test.com',
    password: 'minder123',
    firstName: 'Mary',
    lastName: 'Smith',
    role: 'childminder',
    profileCompleted: true,
    subscription: true,
    phoneNumber: '098-765-4321',
    address: '456 Minder Ave',
    bio: 'Experienced childminder with 5 years of experience'
  },
  'admin@test.com': {
    id: '3',
    email: 'admin@test.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    profileCompleted: true,
    subscription: true,
    phoneNumber: '555-555-5555',
    address: '789 Admin Blvd',
    bio: 'System administrator'
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored auth token and validate
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth validation error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // For demonstration, use test users instead of API call
      const testUser = TEST_USERS[email];
      
      if (testUser && testUser.password === password) {
        const userData = { ...testUser };
        delete userData.password; // Don't store password in state
        
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);

        // Redirect based on user role and profile completion
        if (!userData.profileCompleted) {
          navigate('/profile-setup');
        } else if (!userData.subscription && userData.role !== 'admin') {
          navigate('/subscription');
        } else {
          navigate(`/${userData.role}`);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      // For demonstration, just create a new user object
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        profileCompleted: false,
        subscription: false
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      navigate('/profile-setup');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = {
        ...user,
        ...profileData,
        profileCompleted: true
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
