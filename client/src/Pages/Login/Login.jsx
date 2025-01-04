import React, { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState("");
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const role = location.state?.role;
  const placeholderText = role === "Doctor" ? "CND" : role === "Pharmacist" ? "CNF" : "CNP";

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(
      `Login with email: ${email}, password: ${password}, ${role} ID: ${identifier}`
    );
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, identifier, role }),
      });

      if (!response.ok) {
        setErrorMessage("Invalid email or password. Please try again.");
        throw new Error("Login failed");
      }

      const data = await response.json();
      login(data.token); // Assuming login function handles setting auth state
      console.log("Login successful:", data);

      if (!isAuthenticated && role == "Patient") {
        history.push("/home/medicamente-otc");
      } else if (role == "Doctor") {
        history.push("/doctor/profile");
      } else {
        history.push("/pharmacy");
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
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder={placeholderText}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </div>
      <div className="input-container-password">
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="buttons-container">
        {errorMessage && <p className="text-error" style={{ color: 'red'}}>{errorMessage}</p>}
          <button type="button" onClick={handleLogin}>
          Conectare
          </button>
          <button
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
