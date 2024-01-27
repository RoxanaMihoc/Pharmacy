// src/context/AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = (token) => {
    // Set the JWT token in both state and localStorage
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    // Remove the JWT token from both state and localStorage
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Inside useAuth hook
  return useContext(AuthContext);
};
