import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./styles/user-form.css"; // Import the stylesheet

const UserForm = () => {
  const location = useLocation();
  const { firstName, lastName, email, password, CNP, role, selectedDoctor } = location.state || {};
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
        body: JSON.stringify({ firstName, lastName, email, password, CNP, role, selectedDoctor, formData }),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="form-container2">
      <h1>Other details</h1>
      <form onSubmit={handleRegister}>
        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          City:
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Postal Code:
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Birth Date:
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserForm;
