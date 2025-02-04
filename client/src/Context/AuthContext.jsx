// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setCurrentUserName] = useState(null);
  const history = useHistory();

  useEffect(() => {
    console.log(token)
    if (token) {
      // Check if the token is correctly formatted
      if (token.split(".").length !== 3) {
        console.error("Invalid token format:", token);
        localStorage.removeItem("token"); // Remove bad token
        setToken(null);
        history.push("/login"); // Redirect to login
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        setCurrentUser(decodedToken.userId || null);
        setRole(decodedToken.role || null);
        setCurrentUserName(`${decodedToken.firstName || ""} ${decodedToken.lastName || ""}`);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setToken(null);
        history.push("/login");
      }
    } else {
      setCurrentUser(null);
      setRole(null);
      setCurrentUserName(null);
    }
  }, [token, history]);

  const login = (token) => {
    // Set the JWT token in both state and localStorage
    setToken(token);
    localStorage.setItem('jwt', token);
  };

  const logout = () => {
    // Remove the JWT token from both state and localStorage
    setToken(null);
    localStorage.removeItem("token");
    history.push("/role");
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
