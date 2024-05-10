// Login.js
import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import "./styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [CNP, setCNP] = useState("");
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    // Placeholder logic for demonstration purposes
    console.log(`Login with username: ${email} and password: ${password} and CNP:${CNP}` );
    try {
      e.preventDefault();
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "applicatio/json",
          "Access-Control-Allow-Origin": "*",
        },
        crossDomain: true,
        body: JSON.stringify({email, password, CNP }),
      }); 

      if (!response.ok) {
        setErrorMessage('Invalid email or password. Please try again.');
        throw new Error("Login failed");
      }

      const data = await response.json();
      const token = data.token;
      console.log(data); // Assuming the API returns a message upon successful registration
      console.log('Login successful: ');
      login(token);
      if(!isAuthenticated)
      {
        history.push('/home');
      }
      
    } catch (error) {
      console.error("Login failed:", error.message);
      debugger;
    }
  };

  return (
    <div>
      <form>
        <label>
          <div className="input-container">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>
        <br />
      <label>
        <div className="input-container">
          <input
            type="text"
            placeholder="CNP"
            value={CNP}
            onChange={(e) => setCNP(e.target.value)}
          />
        </div>
      </label>
        <br />
        <label>
          <div className="input-container">
            <input
              type="password"
              className="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>
        <br />
        <div className="buttons-container">
        {errorMessage && <p className="text-error" style={{ color: 'red'}}>{errorMessage}</p>}
          <button type="button" onClick={handleLogin}>
            Login
          </button>
          <button
            type="button"
            onClick={() => console.log("Forgot Password clicked")}
          >
            Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
