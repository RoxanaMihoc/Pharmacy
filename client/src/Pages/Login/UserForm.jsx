import React, { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import "./styles/user-form.css"; // Make sure you have a CSS file for styling

const UserForm = () => {
  const location = useLocation();
  const history = useHistory();

  // These props may be coming from a previous page (optional)
  const {
    firstName: signupFirstName,
    lastName: signupLastName,
    email: signupEmail,
    password,
    identifier,
    role,
    selectedDoctor,
  } = location.state || {};

  // Form State: replicate the fields from your screenshots
  const [formData, setFormData] = useState({
    firstName: signupFirstName || "",
    lastName: signupLastName || "",
    birthDate: "", // Date of Birth
    sex: "", // "Please Select", "Male", "Female" etc.
    height: "", // inches
    weight: "", // pounds
    maritalStatus: "", // Single, Married, etc.
    contactNumber: "", // phone format
    email: signupEmail || "",
    address: "", // street address
    takingMeds: "", // "yes" or "no" for medications
    // Emergency contact
    emergencyContactFirstName: "",
    emergencyContactLastName: "",
    emergencyRelationship: "",
    emergencyContactNumber: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Handle changes for text/select/radio fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Submit all these fields plus the ones from location.state to your API
      const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        crossDomain: true,
        body: JSON.stringify({
          // Fields from previous step or sign-up
          firstName: signupFirstName || formData.firstName,
          lastName: signupLastName || formData.lastName,
          email: signupEmail || formData.email,
          password,
          identifier,
          role,
          selectedDoctor,
          // The new form data
          birthDate: formData.birthDate,
          sex: formData.sex,
          height: formData.height,
          weight: formData.weight,
          maritalStatus: formData.maritalStatus,
          contactNumber: formData.contactNumber,
          address: formData.address,
          takingMeds: formData.takingMeds,
          emergencyContactFirstName: formData.emergencyContactFirstName,
          emergencyContactLastName: formData.emergencyContactLastName,
          emergencyRelationship: formData.emergencyRelationship,
          emergencyContactNumber: formData.emergencyContactNumber,
        }),
      });

      if (!response.ok) {
        setErrorMessage("User already registered. Please use another email.");
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Registration successful:", data);

      // Redirect user, for example to /login
      history.push("/login", { role });
    } catch (error) {
      console.error("Registration failed:", error.message);
      // Keep console open or handle error accordingly
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor
        </div>
        <ul className="nav-links">
          <li>
            <a href="#medicines">Medicines</a>
          </li>
          <li>
            <a href="#doctors">Doctors</a>
          </li>
          <li>
            <a href="#blog">Blog</a>
          </li>
          <li>
            <a href="#faq">FAQ</a>
          </li>
        </ul>
        <div className="nav-buttons"></div>
      </nav>

      {/* FORM CONTAINER */}
      <div className="doctor-selection-container-nav">
        <div className="form-container2">
          <h1>User Information</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleRegister} className="user-details-form">
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <div className="form-row split">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth & Sex */}
            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  placeholder="MM-DD-YYYY"
                  required
                />
              </div>
              <div className="form-group">
                <label>Sex</label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="">Please Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  {/* Add more options if needed */}
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="form-row">
              <div className="form-group">
                <label>Height (inches)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height (inches)"
                />
              </div>
              <div className="form-group">
                <label>Weight (pounds)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight (pounds)"
                />
              </div>
            </div>

            {/* Marital Status */}
            <div className="form-row">
              <div className="form-group">
                <label>Marital Status</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="">Please Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Contact Number & Email */}
            <div className="form-row">
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="(000) 000-0000"
                />
              </div>
              <div className="form-group">
                <label>E-mail</label>
                <input
                  type="email"
                  name="email"
                  placeholder="ex: myname@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <small>example@example.com</small>
              </div>
            </div>

            {/* Address */}
            <div className="form-row">
              <div className="form-group wide">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
              </div>
            </div>

            {/* Taking medications? (Yes/No) */}
            <div className="form-row">
              <label>Taking any medications, currently?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="takingMeds"
                    value="Yes"
                    checked={formData.takingMeds === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="takingMeds"
                    value="No"
                    checked={formData.takingMeds === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Emergency Contact Section */}
            <h2>In case of emergency</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact</label>
                <div className="form-row split">
                  <input
                    type="text"
                    name="emergencyContactFirstName"
                    placeholder="First Name"
                    value={formData.emergencyContactFirstName}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="emergencyContactLastName"
                    placeholder="Last Name"
                    value={formData.emergencyContactLastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Relationship</label>
                <input
                  type="text"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleChange}
                  placeholder="Relationship"
                />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  name="emergencyContactNumber"
                  value={formData.emergencyContactNumber}
                  onChange={handleChange}
                  placeholder="(000) 000-0000"
                />
              </div>
            </div>

            {/* Submit */}
            <button className="button-form" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
