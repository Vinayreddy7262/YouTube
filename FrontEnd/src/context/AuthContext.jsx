// client/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Check if token is expired
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token is expired
        localStorage.removeItem('token');
        setCurrentUser(null);
      } else {
        // Load user data
        const user = JSON.parse(localStorage.getItem('user'));
        setCurrentUser(user);
      }
    }
    
    setIsLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setCurrentUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (userData) => {
    try {
      const res = await axios.post('/api/auth/login', userData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setCurrentUser(res.data);
      return res.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Setup axios interceptor for authentication
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;