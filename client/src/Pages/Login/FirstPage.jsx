// FirstPage.js
import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTablets,
  faUsers,
  faArrowLeftLong,
  faCommentMedical,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/login.css";

const FirstPage = () => {
  const location = useLocation();
  console.log(location);

  // Initialize component state based on the URL parameter
  const [showLogin, setShowLogin] = useState(location.pathname === "/login");

  useEffect(() => {
    setShowLogin(location.pathname === "/login");
  }, [location]);

  return (
    <div>
      <nav className="navbar">
        <div className="nav-logo">
        <Link to="/role" className="nav-logo">
        <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor
      </Link>
        </div>
        <ul className="nav-links">
          <li>
            <a href="#medicines">Medicines</a>
          </li>
          <li>
            <a href="#doctors">Doctors</a>
          </li>
          <li>
            <a href="#blog">Blog</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
        <div className="nav-buttons"></div>
      </nav>
      <div className="first-page">
        <div className="main-container">
          <div className="login-container">
            <div className="button-container">
              <button
                onClick={() => setShowLogin(true)}
                className={showLogin ? "login-selected" : "signup-unselected"}
              >
                Conectare
              </button>
              <button
                onClick={() => setShowLogin(false)}
                className={showLogin ? "signup-unselected" : "login-selected"}
              >
                Înregistrare
              </button>
            </div>
            <div className="form-container">
              {showLogin ? <Login /> : <SignUp />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
