import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { loginUser } from "../Services/authServices.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageDoctor, setErrorMessageDoctor] = useState("");
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const role = location.state?.role;

  console.log(role);

  const placeholderText =
    role === "Doctor" ? "CND" : role === "Pharmacist" ? "CNF" : "CNP";

  // Function to validate Doctor identifier format
  const isValidDoctorIdentifier = (id) => {
    const doctorIdPattern = /^DI\d{6}$/; // "DI" followed by 6 digits
    return doctorIdPattern.test(id);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(
      `Login attempt with: email=${email}, password=${password}, role=${role}, identifier=${identifier}`
    );

    // Validate Doctor Identifier Format
    if (role === "Doctor" && !isValidDoctorIdentifier(identifier)) {
      setErrorMessageDoctor(
        "Codul doctorului trebuie să înceapă cu 'DI' urmat de 6 cifre (ex: DI768543)"
      );
      return; // Stop execution if identifier is invalid
    } else {
      setErrorMessageDoctor(""); // Clear error if valid
    }

    try {
      const { success, data, error } = await loginUser(
        email,
        password,
        identifier,
        role
      );

      if (!success) {
        setErrorMessage(error);
        throw new Error(error);
      }

      login(data.token);
      console.log("Login successful:", data);

      if (!isAuthenticated && role === "Patient") {
        history.push("/home/medicamente-otc");
      } else if (role === "Doctor") {
        history.push("/doctor/profile");
      } else {
        history.push("/home/medicamente-otc");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="input-container">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="user-icon">
          <FontAwesomeIcon icon={faEnvelope} />
        </div>
      </div>

      <div className="input-container">
        <input
          type="text"
          placeholder={placeholderText}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <div className="user-icon">
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>

      <div className="input-container">
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="user-icon">
          <FontAwesomeIcon icon={faLock} />
        </div>
      </div>
      <div className="error-message">
        {errorMessage && (
          <p className="text-error" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
      </div>
      <div className="error-message">
        {errorMessageDoctor && (
          <p className="text-error" style={{ color: "red" }}>
            {errorMessageDoctor}
          </p>
        )}
      </div>

      <div className="buttons-container">
        <button type="submit">Conectare</button>
        <button
          style={{ fontSize: "10px" }}
          type="button"
          onClick={() => console.log("Forgot Password clicked")}
        >
          Ai uitat parola?
        </button>
      </div>
    </form>
  );
};

export default Login;
