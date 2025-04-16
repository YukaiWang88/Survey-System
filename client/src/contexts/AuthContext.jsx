import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:3000/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setCurrentUser(response.data.user);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('authToken');
        console.error('Auth verification failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    verifyUser();
  }, []);
  
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  
  const value = {
    currentUser,
    login,
    register,
    logout,
    isLoading
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};