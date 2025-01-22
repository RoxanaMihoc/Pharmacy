// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setCurrentUserName] = useState(null);
  const history = useHistory();

  useEffect(() => {
    if (token) {
      const [header, payload, signature] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));
      console.log( "lalal Paiload",decodedPayload);
      setCurrentUser(decodedPayload.userId);
      setRole(decodedPayload.role);
      setCurrentUserName(decodedPayload.firstName + " " + decodedPayload.lastName);
    } else {
      setCurrentUser(null);
    }
  }, [token]);

  const login = (token) => {
    // Set the JWT token in both state and localStorage
    setToken(token);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    // Remove the JWT token from both state and localStorage
    setToken(null);
    localStorage.removeItem("token");
    history.push("/login");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, currentUser, role, name }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Inside useAuth hook
  return useContext(AuthContext);
};
