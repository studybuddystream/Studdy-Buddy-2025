// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Base API URL from environment variable (set in .env or deployment platform)
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Set up axios defaults and interceptor
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }

    // Add response interceptor for handling token expiration (skip auth routes)
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (
          error.response?.status === 401 &&
          !error.config.url.includes('/api/auth/signin') &&
          !error.config.url.includes('/api/auth/signup')
        ) {
          console.log('401 detected (non-auth route), logging out');
          logout();
          alert('Your session has expired. Please log in again.');
          window.location.href = '/signin'; // Match your route
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => axios.interceptors.response.eject(interceptor);
  }, [token]);

  // Load user data on mount or token change
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/user`, {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Fetch user error:', err.response?.data || err.message);
          if (err.response?.status === 401) {
            logout();
          }
        }
      };
      fetchUser();
    }
  }, [token, API_URL]); // Add API_URL as dependency

  const signup = async ({ username, email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        username,
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      axios.defaults.headers.common['x-auth-token'] = token;
      return user;
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/signin`, {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      axios.defaults.headers.common['x-auth-token'] = token;
      return user;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, setUser, setToken, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
