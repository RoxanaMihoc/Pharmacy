import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import "./styles/login.css";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [CNP, setCNP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("");
  const history = useHistory();

  const handleRegister = async (e) => {
    e.preventDefault();
    // Instead of making the POST request here, pass the data to the redirected page
    history.push('/doctors', { firstName, lastName, email, password, CNP, role });
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  return (
    <form>
      <label>
        <div className="input-container">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
      </label>
      <br />
      <label>
        <div className="input-container">
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </label>
      <br />
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
      <label>
        <div className="input-container">
        <select value={role} onChange={handleRoleChange} required>
        <option value="" disabled selected>Select your role</option>
        <option value="doctor">Doctor</option>
        <option value="patient">Patient</option>
      </select>
        </div>
      </label>
      <div className="buttons-container">
        {errorMessage && (
          <p className="text-error" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        <button type="submit" onClick={handleRegister}>
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignUp;
