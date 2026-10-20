import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Synchronous state hydration from localStorage to prevent unauthenticated login page flash
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem('goeasy_token');
      const savedUser = localStorage.getItem('goeasy_user');
      if (token && savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.warn('Error reading persisted user:', e);
    }
    return null;
  });

  const [role, setRole] = useState(() => {
    try {
      const token = localStorage.getItem('goeasy_token');
      if (token) {
        return localStorage.getItem('goeasy_role') || null;
      }
    } catch (e) {
      console.warn('Error reading persisted role:', e);
    }
    return null;
  });

  // If no token exists, loading is immediately false. If token exists and user is already cached, loading is also false
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('goeasy_token');
    const savedUser = localStorage.getItem('goeasy_user');
    return !!token && !savedUser;
  });

  // Verify and refresh session in background
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('goeasy_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.getCurrentUser();
        if (res.success && res.user) {
          setCurrentUser(res.user);
          setRole(res.user.role);
          localStorage.setItem('goeasy_role', res.user.role);
          localStorage.setItem('goeasy_user', JSON.stringify(res.user));
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification notice:', err.message);
        if (err.message?.includes('401') || err.message?.includes('expired') || err.message?.includes('Invalid')) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('goeasy_token', token);
    localStorage.setItem('goeasy_role', userData.role);
    localStorage.setItem('goeasy_user', JSON.stringify(userData));
    setCurrentUser(userData);
    setRole(userData.role);
  };

  const logout = () => {
    localStorage.removeItem('goeasy_token');
    localStorage.removeItem('goeasy_role');
    localStorage.removeItem('goeasy_user');
    setCurrentUser(null);
    setRole(null);
  };

  const updateCurrentUser = (userData) => {
    setCurrentUser(userData);
    if (userData.role) {
      setRole(userData.role);
      localStorage.setItem('goeasy_role', userData.role);
    }
    localStorage.setItem('goeasy_user', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    try {
      const res = await api.getCurrentUser();
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setRole(res.user.role);
        localStorage.setItem('goeasy_role', res.user.role);
        localStorage.setItem('goeasy_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.warn(e.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        loading,
        isAuthenticated: !!currentUser,
        login,
        logout,
        refreshUser,
        updateCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
