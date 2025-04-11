// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Set up axios defaults and interceptor once on mount
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }

    // Add response interceptor for handling token expiration
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout(); // Clear auth state on 401
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => axios.interceptors.response.eject(interceptor);
  }, [token]);

  // Load user data on mount if token exists
  useEffect(() => {
    if (token) {
      // Fetch user data using token (e.g., after login or on page load)
      const fetchUser = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/user', {
            headers: { 'x-auth-token': token },
          });
          setUser(res.data);
        } catch (err) {
          console.error('Fetch user error:', err);
          setToken(null);
          localStorage.removeItem('token');
        }
      };
      fetchUser();
    }
  }, [token]);
  
  const signup = async ({ username, email, password }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username, // Changed from 'name' to match backend User model
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      axios.defaults.headers.common['x-auth-token'] = token;
      return user; // For onLogin callback
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', {
        email,
        password,
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      axios.defaults.headers.common['x-auth-token'] = token;
      return user; // For onLogin callback
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
