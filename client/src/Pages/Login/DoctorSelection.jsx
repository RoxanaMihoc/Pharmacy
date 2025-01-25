import React, { useState, useEffect } from "react";
import { useLocation, useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentMedical } from "@fortawesome/free-solid-svg-icons";

import { fetchAllDoctors } from "../Services/authServices";
import "./styles/doctor-selection.css"; // Updated CSS
// import doc from "../../Utils/doc.png";

const DoctorSelection = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation();
  const history = useHistory();
  const { firstName, lastName, email, password, identifier, role } =
    location.state || {};

    useEffect(() => {
      const getAllDoctors = async () => {
        const { success, data, error } = await fetchAllDoctors();
    
        if (success) {
          console.log(data);
          setDoctors(data);
        } else {
          console.error("Error fetching doctor data:", error);
        }
      };
    
      getAllDoctors();
    }, []);
    

  const handleRadioChange = (doctorId) => {
    setSelectedDoctor(doctorId);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      setErrorMessage("Vă rugăm să selectați un doctor.");
      return;
    }
    history.push("/others", {
      firstName,
      lastName,
      email,
      password,
      identifier,
      role,
      selectedDoctor,
    });
  };

  return (
    <div>
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
      <div className="doctor-selection-container-nav">
        <div className="doctor-selection-container">
          <h1>Selectează un doctor:</h1>
          {doctors.map((doctor) => (
            <div key={doctor._id} className="doctor-item">
              {/* Doctor's photo. Replace doctor.imageUrl with the actual property if it differs. 
                Use a placeholder if no image is available. */}
              <div className="doctor-name-photo">
                <img
                  src={
                    doctor.imageUrl
                      ? doctor.imageUrl
                      : "https://via.placeholder.com/50?text=Doctor"
                  }
                  alt={`${doctor.firstName} ${doctor.lastName} profile`}
                  className="doctor-photo"
                />
                <span>
                  {doctor.firstName} {doctor.lastName}
                </span>
              </div>

              <label className="checkbox-label">
                <input
                  type="radio"
                  name="doctorSelection"
                  checked={selectedDoctor === doctor._id}
                  onChange={() => handleRadioChange(doctor._id)}
                />
              </label>
            </div>
          ))}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button className="submit-button" onClick={handleRegister}>
            Următorul
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSelection;
