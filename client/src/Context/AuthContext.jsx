// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt") || null);
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setCurrentUserName] = useState(null);
  const history= useHistory();

  useEffect(() => {
    console.log(token);
    if (token) {
      if (token.split(".").length !== 3) {
        console.error("Invalid token format:", token);
        localStorage.removeItem("token");
        setToken(null);
        history.push("/login");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          console.log("Token expired, logging out...");
          logout();
          return;
        } else {
          setCurrentUser(decodedToken.userId || null);
          setRole(decodedToken.role || null);
          setCurrentUserName(
            `${decodedToken.firstName || ""} ${decodedToken.lastName || ""}`
          );
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setToken(null);
        history.push("/role");
      }
    } else {
      setCurrentUser(null);
      setRole(null);
      setCurrentUserName(null);
    }
  }, [token, history]);

  const login = (token) => {
    setToken(token);
    localStorage.setItem("jwt", token);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    history.push("/role");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, currentUser, role, name }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  // Inside useAuth hook
  return useContext(AuthContext);
}