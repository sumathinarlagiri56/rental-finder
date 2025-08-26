import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Global axios setup: support both Vite proxy (dev) and direct backend (prod)
  useEffect(() => {
    const isViteDev = import.meta.env?.DEV === true;

    if (!isViteDev) {
      // In production, allow overriding backend URL via env
      const envBaseUrl = import.meta.env?.VITE_API_BASE_URL;
      if (envBaseUrl) {
        axios.defaults.baseURL = envBaseUrl;
      } else {
        // Fallback to same-origin (no baseURL) so relative paths work behind reverse proxies
        delete axios.defaults.baseURL;
      }

      // If requests still include '/api' prefix, strip it for direct backend calls
      axios.interceptors.request.use((config) => {
        if (config.url && config.url.startsWith('/api/')) {
          config.url = config.url.replace(/^\/api/, '');
        }
        return config;
      });
    } else {
      // In dev, rely on Vite proxy; ensure no baseURL forces relative '/api' to proxy
      delete axios.defaults.baseURL;
    }
  }, []);

  // Set up axios defaults and restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  // Accept either login({ username, password }) or login(username, password)
  const login = async (arg1, arg2) => {
    try {
      const creds = typeof arg1 === 'object' && arg1 !== null
        ? { username: arg1.username, password: arg1.password }
        : { username: arg1, password: arg2 };

      const response = await axios.post('/api/auth/login', creds);

      const { token, id, username: userUsername, email } = response.data;

      const userData = { id, username: userUsername, email };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Invalid username or password',
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);

      const { token, id, username, email } = response.data;

      const userInfo = { id, username, email };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userInfo));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(userInfo);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed. Please try again.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];

    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 