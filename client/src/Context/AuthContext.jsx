// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (token) {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        setCurrentUser(decodedPayload.userId);
    } else {
        setCurrentUser(null);
    }
}, [token]);

  const login = (token) => {
    // Set the JWT token in both state and localStorage
    setToken(token);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    // Remove the JWT token from both state and localStorage
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Inside useAuth hook
  return useContext(AuthContext);
};
