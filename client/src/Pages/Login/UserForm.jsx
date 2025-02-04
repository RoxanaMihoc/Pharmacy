import React, { useState } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";
import { registerUser } from "../Services/authServices";
import "./styles/user-form.css"; // Make sure you have a CSS file for styling

const UserForm = () => {
  const location = useLocation();
  const history = useHistory();

  const {
    firstName,
    lastName,
    email,
    password,
    identifier,
    role,
    selectedDoctor,
    doctorName,
  } = location.state || {};

  // Form State: replicate the fields from your screenshots
  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    birthDate: "", // Date of Birth
    gender: "", // "Please Select", "Male", "Female" etc.
    height: "", // inches
    weight: "", // pounds
    maritalStatus: "", // Single, Married, etc.
    contactNumber: "", // phone format
    email: email || "",
    address: "", // street address
    city: "",
    medicationList: "", // "yes" or "no" for medications
    postalCode: "",
  });

  console.log(formData);

  const [errorMessage, setErrorMessage] = useState("");

  // Handle changes for text/select/radio fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password,
        identifier,
        role,
        selectedDoctor,
        doctorName,
        birthDate: formData.birthDate,
        gender: formData.gender,
        height: formData.height,
        weight: formData.weight,
        maritalStatus: formData.maritalStatus,
        phoneNumber: formData.contactNumber,
        address: formData.address,
        postalCode: formData.postalCode,
        medicationList: formData.medicationList,
        city: formData.city,
      };
  
      const { success, data, error } = await registerUser(userData);
  
      if (success) {
        console.log("Registration successful:", data);
  
        // Redirect user, for example, to /login
        history.push("/login", { role });
      } else {
        setErrorMessage(error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      setErrorMessage(error.message);
    }
  };
  

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo">
          <Link to="/role" className="nav-logo">
            <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor
          </Link>
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
          <h1>Alte informatii</h1>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleRegister} className="user-details-form">
            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Nume</label>
                <div className="form-row split">
                  <input
                    type="text"
                    name="Nume"
                    placeholder="Nume"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="Prenume"
                    placeholder="Prenume"
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
                <label>Zi de naștere</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  placeholder="DD-MM-YYYY"
                  required
                />
              </div>
              <div className="form-group">
                <label>Gen</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selectează</option>
                  <option value="Feminin">Feminin</option>
                  <option value="Masculin">Masculin</option>
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="form-row">
              <div className="form-group">
                <label>Înaltime (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Înaltime"
                />
              </div>
              <div className="form-group">
                <label>Greutate (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Greutate"
                />
              </div>
            </div>

            {/* Marital Status */}
            <div className="form-row">
              <div className="form-group">
                <label>Status marital</label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                >
                  <option value="">Selectează</option>
                  <option value="Single">Singur</option>
                  <option value="Married">Căsătorit</option>
                  <option value="Divorced">Divorțat</option>
                  <option value="Widowed">Văduv</option>
                </select>
              </div>
            </div>

            {/* Contact Number & Email */}
            <div className="form-row">
              <div className="form-group">
                <label>Număr de telefon</label>
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
                  placeholder="ex: nume@exemplu.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-row">
              <div className="form-group wide">
                <label>Adresă</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Adresă"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group wide">
                <label>Oraș</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Oraș"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group wide">
                <label>Cod Poștal</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Cod poștal"
                />
              </div>
            </div>

            {/* Taking medications? (Yes/No) */}
            <div className="form-row">
              <label>Luați un tratament in acest moment?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="takingMeds"
                    value="Da"
                    checked={formData.takingMeds === "Da"}
                    onChange={handleChange}
                  />
                  Da
                </label>
                <label>
                  <input
                    type="radio"
                    name="takingMeds"
                    value="No"
                    checked={formData.takingMeds === "No"}
                    onChange={handleChange}
                  />
                  Nu
                </label>
              </div>
            </div>

            {/* Conditionally show a text area if takingMeds === "Da" */}
            {formData.takingMeds === "Da" && (
              <div className="form-row wide">
                <label>Ce medicamente luați?</label>
                <textarea
                  name="medicationList"
                  value={formData.medicationList}
                  onChange={handleChange}
                  placeholder="Lista medicamentelor pe care le luați..."
                />
              </div>
            )}

            {/* Submit */}
            <button className="button-form" type="submit">
              Trimite
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
