import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./styles/user-form.css"; // Import the stylesheet

const UserForm = () => {
  const location = useLocation();
  const history =useHistory();
  const { firstName, lastName, email, password, identifier, role, selectedDoctor } = location.state || {};
  const [formData, setFormData] = useState({
    gender: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    birthDate: "",
  });

  const handleRegister = async (e) => {
    try {
      e.preventDefault();
      console.log(formData);
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "applicatio/json",
          "Access-Control-Allow-Origin": "*",
        },
        crossDomain: true,
        body: JSON.stringify({ firstName, lastName, email, password, identifier, role, selectedDoctor, formData }),
      });

      if (!response.ok) {
        setErrorMessage("User already registered. Please use another email.");
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log(data); // Assuming the API returns a message upon successful registration
      history.push("/login", {role});
    } catch (error) {
      console.error("Registration failed:", error.message);
      debugger;
      setTimeout(() => {
        // Empty block to keep the console open
      }, 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container2">
      <h1>Alte detalii</h1>
      <form onSubmit={handleRegister} className="form-c">
        <label>
          Gen:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Selectează gen</option>
            <option value="Bărbat">Bărbat</option>
            <option value="Femeie">Femeie</option>
          </select>
        </label>
        <label>
         Număr de telefon:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Număr de telefon"
            required
          />
        </label>
        <label>
          Adresă:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Adresă"
            required
          />
        </label>
        <label>
          Oraș:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Oraș"
            required
          />
        </label>
        <label>
          Cod poștal:
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            placeholder="Cod poștal"
            required
          />
        </label>
        <label>
          Zi de naștere:
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </label>
        <button className="button-form" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
