import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { registerUser } from "../Services/authServices.js";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const role = location.state?.role;
  console.log(role);
  const placeholderText =
    role === "Doctor" ? "CND" : role === "Pharmacist" ? "CNF" : "CNP";

  const handleRegister = async (e) => {
    e.preventDefault();
    if (role == "Patient") {
      history.push("/doctors", {
        firstName,
        lastName,
        email,
        password,
        identifier,
        role,
      });
    } else {
      register();
    }
  };

  const register = async (e) => {
    history.push("/role");
  };

  return (
    <form>
      <label>
        <div className="input-container">
          <input
            type="text"
            placeholder="Nume"
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
            placeholder="Prenume"
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
            placeholder={placeholderText}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
      </label>
      <br />
      <label>
        <div className="input-container-password">
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </label>
      <br />
      <br></br>

      <div className="buttons-container">
        {errorMessage && (
          <p className="text-error" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        <button type="submit" onClick={handleRegister}>
          Înregistrare
        </button>
      </div>
    </form>
  );
};

export default SignUp;
