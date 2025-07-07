import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

// Create auth context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on app load)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setCurrentUser(JSON.parse(storedUser));
          // Optional: Verify token with backend
          // await authAPI.getProfile();
        }
      } catch (err) {
        console.error('Auth verification failed:', err);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Send OTP
  const sendOTP = async (email) => {
    setError(null);
    try {
      setLoading(true);
      const result = await authAPI.sendOTP(email);
      return result;
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up
  const signup = async (userData) => {
    setError(null);
    try {
      setLoading(true);
      const result = await authAPI.signup(userData);
      return result;
    } catch (err) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (credentials) => {
    setError(null);
    try {
      setLoading(true);
      const result = await authAPI.login(credentials);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authAPI.logout();
    setCurrentUser(null);
  };

  // Auth context value
  const value = {
    currentUser,
    loading,
    error,
    sendOTP,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 