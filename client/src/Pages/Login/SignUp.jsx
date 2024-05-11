import React, { useState } from "react";
import "./styles/login.css";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [CNP, setCNP] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      console.log(firstName + " " + lastName + " " + email + " " + password);
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "applicatio/json",
          "Access-Control-Allow-Origin": "*",
        },
        crossDomain: true,
        body: JSON.stringify({ firstName, lastName, email, password, CNP, role }),
      });

      if (!response.ok) {
        setErrorMessage("User already registered. Please use another email.");
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log(data); // Assuming the API returns a message upon successful registration
    } catch (error) {
      console.error("Registration failed:", error.message);
      debugger;
      setTimeout(() => {
        // Empty block to keep the console open
      }, 5000);
    }
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
