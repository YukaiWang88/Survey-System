import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (token) {
          const response = await axios.get('http://localhost:3000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setCurrentUser(response.data);
        }
      } catch (err) {
        // Token expired or invalid
        localStorage.removeItem('authToken');
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('authToken', response.data.token);
      setCurrentUser(response.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password
      });
      
      localStorage.setItem('authToken', response.data.token);
      setCurrentUser(response.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};