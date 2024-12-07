import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Debug log
          console.log('Checking auth with token:', token);
          
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Debug log
          console.log('Auth check response:', response.status);
          
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
            // Debug log
            console.log('User authenticated:', data.user);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user_type');
            // Debug log
            console.log('Auth check failed:', data);
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const value = {
    user,
    setUser,
    loading
  };

  // Debug log
  console.log('AuthContext state:', { user, loading });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
