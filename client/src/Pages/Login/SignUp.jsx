import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  const validateInputs = () => {
    if (!email.includes("@")) {
      setErrorMessage("Email-ul trebuie să conțină @");
      return false;
    }
    if (!/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(password)) {
      setErrorMessage(
        "Parola trebuie să conțină cel puțin 8 caractere, o cifra, o literă mare și un caracter special."
      );
      return false;
    }
    if (!/^[0-9]{13}$/.test(identifier)) {
      setErrorMessage("CNP-ul trebuie să conțină exact 13 cifre.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    history.push("/doctors", {
      firstName,
      lastName,
      email,
      password,
      identifier,
    });
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
          <div className="user-icon">
                                  <FontAwesomeIcon
                                  icon={faUser}
                                  />
                                  </div>
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
          <div className="user-icon">
                                  <FontAwesomeIcon
                                  icon={faUser}
                                  />
                                  </div>
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
          <div className="user-icon">
                                  <FontAwesomeIcon
                                  icon={faEnvelope}
                                  />
                                  </div>
        </div>
      </label>
      <br />
      <label>
        <div className="input-container">
          <input
            type="text"
            placeholder="CNP"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            
          />
          <div className="user-icon">
                                  <FontAwesomeIcon
                                  icon={faUserCircle}
                                  />
                                  </div>
        </div>
      </label>
      <br />
      <label>
        <div className="input-container">
          <input
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="user-icon">
                                  <FontAwesomeIcon
                                  icon={faLock}
                                  />
                                  </div>
        </div>
      </label>
      <br />
      <div className="error-message">
      {errorMessage && (
          <p className="text-error" style={{ color: "red" }}>
            {errorMessage}
          </p>
        )}
        </div>
      <div className="buttons-container">
        <button type="submit" onClick={handleRegister}>
          Înregistrare
        </button>
      </div>
    </form>
  );
};

export default SignUp;
