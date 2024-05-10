// FirstPage.js
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import './styles/login.css';

const FirstPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="first-page">
      <div className="main-container">
        <div className="login-container">
          <div className="button-container">
            <button
            onClick={() => setShowLogin(true)}
            className={showLogin ? 'login-selected' : 'signup-unselected'}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={showLogin ? 'signup-unselected' : 'login-selected'}
          >
            Sign Up  
          </button>
          </div>
          <div className="form-container">
            {showLogin ? <Login /> : <SignUp />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
