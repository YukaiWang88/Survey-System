import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Set up axios auth header helper
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  };

  // Check for token on initial load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set the auth header
        setAuthToken(token);
        
        // Verify the token
        const res = await axios.get('http://localhost:3000/api/auth/verify');
        setCurrentUser(res.data.user);
      } catch (err) {
        // Clear invalid token
        setAuthToken(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Register function
  const register = async (name, email, password) => {
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      name, email, password
    });
    
    const { token, user } = res.data;
    setAuthToken(token);
    setCurrentUser(user);
    return user;
  };
  
  // Login function
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:3000/api/auth/login', {
      email, password
    });
    
    const { token, user } = res.data;
    setAuthToken(token);
    setCurrentUser(user);
    return user;
  };
  
  // Logout function
  const logout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};